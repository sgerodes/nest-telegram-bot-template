/* DO NOT EDIT, file generated by nestjs-i18n */

/* eslint-disable */
/* prettier-ignore */
import { Path } from "nestjs-i18n";
/* prettier-ignore */
export type I18nTranslations = {
    "i18n": {
        "metadata": {
            "bot_name": string;
            "description": string;
            "short_description": string;
        };
        "command_descriptions": {
            "start": string;
            "help": string;
            "hello": string;
            "quiz": string;
            "quiz_manager": string;
        };
        "shared": {
            "buttons": {
                "close": string;
                "leave": string;
            };
        };
        "command": {
            "start": {
                "message": string;
                "buttons": {
                    "welcome_button": string;
                };
            };
            "help": {
                "message": string;
            };
            "hello": {
                "message": string;
                "scene": {
                    "first_message": string;
                    "second_message": string;
                };
            };
            "quizAdmin": {
                "scene": {
                    "enter_message": string;
                    "create_quiz_question_message": string;
                    "create_quiz_question_message_example": string;
                    "error_no_quiz_provided": string;
                    "error_invalid_date_format": string;
                    "error_quiz_has_incorrect_structure": string;
                    "error_quiz_has_correct_answer_does_not_exists": string;
                    "create_quiz_can_be_accepted": string;
                    "create_quiz_saving": string;
                };
                "buttons": {
                    "enter_message_update": string;
                    "enter_message_create": string;
                    "create_quiz_example": string;
                    "create_quiz_preview": string;
                    "save_quiz": string;
                };
            };
            "helloPrivate": {
                "message": string;
            };
            "helloGroup": {
                "message": string;
            };
        };
        "menus": {
            "start": {
                "message": string;
                "buttons": {
                    "welcome_button": string;
                    "close": string;
                };
            };
            "hello": {
                "message": string;
                "scene": {
                    "first_message": string;
                };
            };
        };
    };
};
/* prettier-ignore */
export type I18nPath = Path<I18nTranslations>;
