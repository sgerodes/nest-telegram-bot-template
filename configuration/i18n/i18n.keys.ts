export const i18nKeys = {
  "i18n": {
    "metadata": {
      "bot_name": "i18n.metadata.bot_name",
      "description": "i18n.metadata.description",
      "short_description": "i18n.metadata.short_description"
    },
    "command_descriptions": {
      "start": "i18n.command_descriptions.start",
      "help": "i18n.command_descriptions.help",
      "hello": "i18n.command_descriptions.hello",
      "quiz": "i18n.command_descriptions.quiz",
      "quiz_manager": "i18n.command_descriptions.quiz_manager",
      "ton_balance": "i18n.command_descriptions.ton_balance",
      "ton_paylink": "i18n.command_descriptions.ton_paylink"
    },
    "shared": {
      "buttons": {
        "close": "i18n.shared.buttons.close",
        "leave": "i18n.shared.buttons.leave"
      }
    },
    "games": {
      "menu_button": "i18n.games.menu_button",
      "select_game": "i18n.games.select_game",
      "quiz_session": {
        "button": "i18n.games.quiz_session.button",
        "description": "i18n.games.quiz_session.description",
        "starting": "i18n.games.quiz_session.starting",
        "no_questions": "i18n.games.quiz_session.no_questions"
      }
    },
    "command": {
      "start": {
        "message": "i18n.command.start.message",
        "buttons": {
          "welcome_button": "i18n.command.start.buttons.welcome_button"
        }
      },
      "help": {
        "message": "i18n.command.help.message"
      },
      "hello": {
        "message": "i18n.command.hello.message",
        "scene": {
          "first_message": "i18n.command.hello.scene.first_message",
          "second_message": "i18n.command.hello.scene.second_message"
        }
      },
      "quizAdmin": {
        "scene": {
          "enter_message": "i18n.command.quizAdmin.scene.enter_message",
          "create_quiz_question_message": "i18n.command.quizAdmin.scene.create_quiz_question_message",
          "create_quiz_question_message_example": "i18n.command.quizAdmin.scene.create_quiz_question_message_example",
          "error_no_quiz_provided": "i18n.command.quizAdmin.scene.error_no_quiz_provided",
          "error_invalid_date_format": "i18n.command.quizAdmin.scene.error_invalid_date_format",
          "error_quiz_has_incorrect_structure": "i18n.command.quizAdmin.scene.error_quiz_has_incorrect_structure",
          "error_quiz_has_correct_answer_does_not_exists": "i18n.command.quizAdmin.scene.error_quiz_has_correct_answer_does_not_exists",
          "create_quiz_can_be_accepted": "i18n.command.quizAdmin.scene.create_quiz_can_be_accepted",
          "create_quiz_saving": "i18n.command.quizAdmin.scene.create_quiz_saving"
        },
        "buttons": {
          "enter_message_update": "i18n.command.quizAdmin.buttons.enter_message_update",
          "enter_message_create": "i18n.command.quizAdmin.buttons.enter_message_create",
          "create_quiz_example": "i18n.command.quizAdmin.buttons.create_quiz_example",
          "create_quiz_preview": "i18n.command.quizAdmin.buttons.create_quiz_preview",
          "save_quiz": "i18n.command.quizAdmin.buttons.save_quiz"
        }
      },
      "helloPrivate": {
        "message": "i18n.command.helloPrivate.message"
      },
      "helloGroup": {
        "message": "i18n.command.helloGroup.message"
      }
    }
  }
} as const;