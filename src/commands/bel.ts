import type {
    ButtonInteraction,
    CommandInteraction,
} from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import fetch from 'node-fetch'

@Discord()
export class Deur {

    @Slash("deur", {"description": "Belt aan, en laat een knop zien waarmee iemand kan laten zien dat ze er aan komen"})
    async hello(
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();

        const helloBtn = new MessageButton()
            .setLabel("U HEEFT AANGEBELD")
            .setEmoji("🚪")
            .setStyle("PRIMARY")
            .setCustomId("kom-er-aan-btn");

        const row = new MessageActionRow().addComponents(helloBtn);

        this.strobe();

        interaction.editReply({
            components: [row],
        });
    }

    @ButtonComponent("kom-er-aan-btn")
    helloBtn(interaction: ButtonInteraction): void {
        interaction.reply(`DE DEUR IS NU GEOPEND`);
    }

    async strobe() {
        // curl -X POST -F 'r=0' -F 'g=100' -F 'b=100' http://192.168.12.134/setColors/

        await Deur.callLeds(100, 100, 100);

        await Deur.callLeds(0, 0, 0);
    }

    private static async callLeds(red: number, green: number, blue: number) {
        console.log("STARTING LEDS")

        const response = await fetch("http://192.168.12.134/setColors",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'r': red.toString(),
                    'g': green.toString(),
                    'b': blue.toString()
                }
            });

        if (!response.ok) {
            console.error("Error");
        } else if (response.status >= 400) {
            console.error('HTTP Error: ' + response.status + ' - ' + response.statusText);
        }

        console.log(response)
    }
}
