import { Bot } from "grammy";
import { startCommand } from "./start.command";
import { customSpreadCommand } from "./customSpread.command";
import { aboutTarotCommand } from "./aboutTarot.command";
import { adminPanelCommand } from "./adminPanel.command";
import { supportCommand } from "./support.command";
import { bonusCommand } from "./bonus.command";
import { subscriptionCommand } from "./subscription.command";
import { referralCommand } from "./referral.command";
import { newSpreadCommand } from "./newSpread.command";

export default function registerCommands(bot: Bot): void {
    // Регистрируем команду /start
    bot.command("start", startCommand);
    // Регистрируем команду /new_spread
    bot.command("new_spread", newSpreadCommand);
    // Регистрируем команду /bonus
    bot.command("bonus", bonusCommand);
    // Регистрируем команду /subscription
    bot.command("subscription", subscriptionCommand);
    // Регистрируем команду /custom_spread
    bot.command("custom_spread", customSpreadCommand);
    // Регистрируем команду /support
    bot.command("support", supportCommand);
    // Регистрируем команду /referral
    bot.command("referral", referralCommand);
    // Регистрируем команду /about_tarot
    bot.command("about_tarot", aboutTarotCommand);
    // Регистрируем команду /admin_panel
    bot.command("admin_panel", adminPanelCommand);
}