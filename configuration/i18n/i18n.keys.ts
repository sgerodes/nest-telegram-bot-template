export const i18nKeys = {
  i18n: {
    metadata: {
      bot_name: 'i18n.metadata.bot_name',
      description: 'i18n.metadata.description',
      short_description: 'i18n.metadata.short_description',
    },
    command_descriptions: {
      start: 'i18n.command_descriptions.start',
      hello: 'i18n.command_descriptions.hello',
    },
    shared: {
      buttons: {
        close: 'i18n.shared.buttons.close',
      },
    },
    command: {
      start: {
        message: 'i18n.command.start.message',
        buttons: {
          welcome_button: 'i18n.command.start.buttons.welcome_button',
        },
      },
      help: {
        message: 'i18n.command.help.message',
      },
      hello: {
        message: 'i18n.command.hello.message',
        scene: {
          first_message: 'i18n.command.hello.scene.first_message',
          second_message: 'i18n.command.hello.scene.second_message',
        },
      },
      helloPrivate: {
        message: 'i18n.command.helloPrivate.message',
      },
      helloGroup: {
        message: 'i18n.command.helloGroup.message',
      },
    },
  },
} as const;
