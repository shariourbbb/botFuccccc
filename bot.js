// bot.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { admin_cmd } from "./admin_panels.js";
import { Bot } from "grammy";
import { BotApi, BotCommand, DataStore, PDict, U, matchesPtbMessageFilter } from "./compat.js";
import { BOT_NAME, BOT_TOKEN, BOT_USERNAME } from "./config.js";
import { cancel_cmd, DEFAULT_BOT_DESCRIPTION, format_order_id_display, is_admin, start } from "./core.js";
import { db } from "./db.js";
import { pyEq, pyGet, pySlice, pyStr, pyStrip, pySub, pyT } from "./helpers.js";
import { show_cart, show_categories, show_info, show_my_courses, show_my_ebooks, show_profile } from "./screens.js";
import { handle_callback } from "./callbacks_user.js";
import { handle_user_input } from "./user_input.js";

export async function check_status(update, context) {
  let c_obj, msg, order, order_id, status_bn, user_id;
  if (pyT((!pyT(context.args)))) {
      void ((await update.message.reply_text("📌 **ব্যবহার:** `/status ORDER_ID`\nযেমন: `/status ORD-1001` বা `/status 1001`", { parse_mode: "Markdown" })));
      return;
  }
  order_id = pyStrip(pySub(context.args, 0));
  order = db.get_order(order_id);
  if (pyT((!pyT(order)))) {
      void ((await update.message.reply_text("❌ Order not found.")));
      return;
  }
  user_id = update.effective_user.id;
  if (pyT((((__v0) => (pyT(__v0) ? ((!pyT(is_admin(user_id)))) : __v0))(((!pyEq(pyGet(order, "user_id"), user_id))))))) {
      void ((await update.message.reply_text("⛔ You are not authorized to view this order.")));
      return;
  }
  status_bn = (pyT((pyEq(pySub(order, "status"), "pending"))) ? ("⏳ Pending") : ((pyT((pyEq(pySub(order, "status"), "approved"))) ? ("✅ Approved") : ("❌ Rejected"))));
  msg = `📦 **Order Status**
━━━━━━━━━━━━━━━━━━━━

🆔 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
📖 **Course:** ${pyStr(pyGet(order, "course_name", "N/A"))}
💰 **Amount:** ${pyStr(pySub(order, "amount"))} ৳
💳 **Method:** ${pyStr(pyGet(order, "payment_method", "N/A"))}
🔑 **TrxID:** \`${pyStr(pyGet(order, "trxid", "N/A"))}\`
📅 **Time:** ${pyStr(pySlice(pyGet(order, "date", "N/A"), null, 19, null))}
📌 **Status:** ${pyStr(status_bn)}`;
  if (pyT((pyEq(pySub(order, "status"), "approved")))) {
      c_obj = db.get_course(pyGet(order, "course_id", ""));
      if (pyT((((__v1) => (pyT(__v1) ? (pyGet(c_obj, "access_link")) : __v1))(c_obj)))) {
            msg += `

🔗 **Access Link:** ${pyStr(pySub(c_obj, "access_link"))}`;
      }
  }
  void ((await update.message.reply_text(msg, { parse_mode: "Markdown" })));
}




// ==================== MAIN INITIALIZATION (grammY port of PTB main()) ====================

const logger = console;

// PTB-style per-user / global state (compat.js DataStore)
const userStore = new DataStore();
const chatStores = new Map();
function chatDataOf(chatId) {
  if (!chatStores.has(chatId)) chatStores.set(chatId, new PDict());
  return chatStores.get(chatId);
}

async function post_init(botApi) {
  try {
    const desc = db.get_setting("bot_description", DEFAULT_BOT_DESCRIPTION);
    await botApi.set_my_description({ description: desc });
    await botApi.set_my_commands([new BotCommand("start", "Start or refresh the bot")]);
  } catch (e) {
    logger.error(`Could not set bot description or commands on startup: ${e}`);
  }
}

async function handle_application_error(error) {
  // Log unexpected errors without leaving updates unhandled (PTB error handler).
  logger.error("Unhandled Telegram update", error);
}

// PTB CommandHandler args: message text split on whitespace, minus the command.
function ptbArgs(ctx) {
  const text = ctx.msg?.text || "";
  if (!text.startsWith("/")) return [];
  return text.split(/\s+/).slice(1);
}

// Wrap a PTB-style handler (update, context) over a grammY ctx.
const bot = new Bot(BOT_TOKEN);
const botApi = new BotApi(bot.api);

function ptbWrap(fn) {
  return async (ctx) => {
    const uid = ctx.from?.id ?? 0;
    const chatId = ctx.chat?.id ?? uid;
    const context = {
      bot: botApi,
      args: ptbArgs(ctx),
      user_data: userStore.user(uid),
      bot_data: userStore.global,
      chat_data: chatDataOf(chatId),
    };
    try {
      await fn(new U(ctx), context);
    } catch (e) {
      await handle_application_error(e);
    }
  };
}

async function main() {
  // Commands (same set and order as the Python bot)
  bot.command("start", ptbWrap(start));
  bot.command("home", ptbWrap(start));
  bot.command("menu", ptbWrap(start));
  bot.command("cancel", ptbWrap(cancel_cmd));
  bot.command("stop", ptbWrap(cancel_cmd));
  bot.command("admin", ptbWrap(admin_cmd));
  bot.command("status", ptbWrap(check_status));
  bot.command("courses", ptbWrap((u, c) => show_categories(u, c)));
  bot.command("mycourses", ptbWrap((u, c) => show_my_courses(u, c)));
  bot.command("ebooks", ptbWrap((u, c) => show_my_ebooks(u, c)));
  bot.command("profile", ptbWrap((u, c) => show_profile(u, c)));
  bot.command("cart", ptbWrap((u, c) => show_cart(u, c)));
  bot.command("help", ptbWrap((u, c) => show_info(u, c)));
  bot.command("info", ptbWrap((u, c) => show_info(u, c)));

  // Callbacks
  bot.on("callback_query:data", ptbWrap(handle_callback));

  // Text, Photo, Video, Document & Forwarded Messages
  bot.on("message", async (ctx, next) => {
    if (!matchesPtbMessageFilter(ctx.msg)) { await next(); return; }
    await ptbWrap(handle_user_input)(ctx);
  });

  bot.catch((err) => { handle_application_error(err.error); });

  await post_init(botApi);

  console.log(`==================================================`);
  console.log(`🚀 ${BOT_NAME} course selling bot started successfully!`);
  console.log(`🤖 Bot Username: @${BOT_USERNAME}`);
  console.log(`📱 Send /start on Telegram to begin.`);
  console.log(`==================================================`);

  // run_polling(poll_interval=1.0, timeout=30, bootstrap_retries=-1)
  bot.api.config.timeout = 30;   // seconds, like PTB read/write timeouts
  await bot.start({
    allowed_updates: [
      "message", "edited_message", "channel_post", "edited_channel_post",
      "callback_query", "message_reaction", "message_reaction_count",
      "inline_query", "chosen_inline_result", "shipping_query",
      "pre_checkout_query", "poll", "poll_answer", "my_chat_member",
      "chat_member", "chat_join_request",
    ],
    drop_pending_updates: false,
  });
}

import { pathToFileURL } from "node:url";
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
}
