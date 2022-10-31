import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GreetingFunctionDefinition } from "../functions/greeting_function.ts";
import { PlainTextElement } from "https://deno.land/x/slack_types@3.0.3/mod.ts";
import SlackSchema from "https://deno.land/x/deno_slack_sdk@1.4.0/schema/slack/mod.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const GreetingWorkflow = DefineWorkflow({
  callback_id: "greeting_workflow",
  title: "troubleshooting_workflow",
  description: "troubleshooting workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
const inputForm = GreetingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "troubleshooting workflow",
    interactivity: GreetingWorkflow.inputs.interactivity,
    submit_label: "作成",
    fields: {
      elements: [{
        name: "summary",
        title: "何が起こっているか一言で",
        type: Schema.types.string,
        long: true,
      }, {
        name: "user_purpose",
        title: "ユーザー区分(ランサー・クライアント)",
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          enum: [
            "ランサー",
            "クライアント",
            "全て",
          ],
        },
      }, {
        name: "process",
        title: "再現手順",
        type: Schema.types.string,
        long: true,
      }, {
        name: "date",
        title: "発生日時",
        type: Schema.slack.types.timestamp,
      }, {
        name: "url",
        title: "発生するページのurl",
        type: Schema.types.string,
      }, {
        name: "level",
        title: "障害レベル",
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          enum: [
            "A",
            "B",
            "C",
            "D",
            "S",
          ],
        },
      }, {
        name: "environment",
        title: "OSとブラウザの種類",
        type: Schema.types.string,
      }],
      required: ["summary"],
    },
  },
);


const greetingFunctionStep = GreetingWorkflow.addStep(
  GreetingFunctionDefinition,
  {
    summary:       inputForm.outputs.fields.summary,
    // user_purpose:  inputForm.outputs.fields.user_purpose,
    process:       inputForm.outputs.fields.process,
    date:          inputForm.outputs.fields.date,
    url:           inputForm.outputs.fields.url,
    // level:         inputForm.outputs.fields.level,
    environment:   inputForm.outputs.fields.environment

  },
);

GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: "XXXXXXX",
  message: greetingFunctionStep.outputs.report,
});

export default GreetingWorkflow;
