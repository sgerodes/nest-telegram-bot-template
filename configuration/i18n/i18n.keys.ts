export const i18nKeys = {
  "i18n": {
    "metadata": {
      "bot_name": "i18n.metadata.bot_name",
      "description": "i18n.metadata.description",
      "short_description": "i18n.metadata.short_description"
    },
    "command_descriptions": {
      "start": "i18n.command_descriptions.start",
      "hello": "i18n.command_descriptions.hello"
    },
    "shared": {
      "buttons": {
        "close": "i18n.shared.buttons.close"
      }
    },
    "menus": {
      "start": {
        "message": "i18n.menus.start.message",
        "buttons": {
          "welcome_button": "i18n.menus.start.buttons.welcome_button"
        }
      },
      "hello": {
        "message": "i18n.menus.hello.message",
        "scene": {
          "first_message": "i18n.menus.hello.scene.first_message",
          "second_message": "i18n.menus.hello.scene.second_message"
        }
      }
    }
  }
} as const;