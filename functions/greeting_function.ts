import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "greeting_function",
  title: "Generate a greeting",
  description: "Generate a greeting",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      summary: {
        type: Schema.types.string,
        description: "summary",
      },
      // user_purpose: {
      //   type: Schema.types.array,
      //   description: "user purpose",
      // },
      process: {
        type: Schema.types.string,
        description: "process",
      },
      date: {
        type: Schema.slack.types.timestamp,
        description: "date",
      },
      url:{
        type: Schema.types.string,
      },
      // level:{
      //   type: Schema.types.array,
      // },
      environment:{
        type: Schema.types.string,
      },
    },
    required: ["summary"],
  },
  output_parameters: {
    properties: {
      report: {
        type: Schema.types.string,
        description: "incient report",
      },
    },
    required: ["report"],
  },
});

export default SlackFunction(
  GreetingFunctionDefinition,
  ({ inputs }) => {
    const { summary, process, date, url, environment } = inputs;
    if (typeof date === 'string'){
      const dateTime = new Date(date * 1000);
      const dateTimeString = dateTime.toString;
    }
    // const user_purpose_text = user_purpose[0];
    // const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    // const salutation =
    //   salutations[Math.floor(Math.random() * salutations.length)];
    const report = `
    @channel  \n
    障害が発生しました。\n\n
    心当たりのある方は障害対応をお願いいたいします。\n\n

    起票者は以下対応をお願いいたします。\n
    1. issueの作成
    [こちら]() \n
    3. 障害対応完了後、下記リンクからkintoneに障害報告\n
      https://slack.com/shortcuts/XXXXX/XXXXX \n

    \`\`\`
    - 何が起きていますか
    ${summary}\n
    - 再現手順
    ${process}\n
    - 発生日時
    ${date ?? "なし"}\n
    - 発生するページのurl
    ${url}\n
    - OSとブラウザの種類
    ${environment}\n
    \`\`\`
    `;
    // `${salutation}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${message}`;
    return { outputs: { report } };
  },
);
