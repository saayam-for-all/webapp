import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutEventsRequest } from "../models/models_0";
import { PersonalizeEventsClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../PersonalizeEventsClient";
/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link PutEventsCommand}.
 */
export interface PutEventsCommandInput extends PutEventsRequest {
}
/**
 * @public
 *
 * The output of {@link PutEventsCommand}.
 */
export interface PutEventsCommandOutput extends __MetadataBearer {
}
declare const PutEventsCommand_base: {
    new (input: PutEventsCommandInput): import("@smithy/smithy-client").CommandImpl<PutEventsCommandInput, PutEventsCommandOutput, PersonalizeEventsClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    new (__0_0: PutEventsCommandInput): import("@smithy/smithy-client").CommandImpl<PutEventsCommandInput, PutEventsCommandOutput, PersonalizeEventsClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
/**
 * <p>Records item interaction event data. For more information see
 *       <a href="https://docs.aws.amazon.com/personalize/latest/dg/recording-item-interaction-events.html">Recording item interaction events</a>.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { PersonalizeEventsClient, PutEventsCommand } from "@aws-sdk/client-personalize-events"; // ES Modules import
 * // const { PersonalizeEventsClient, PutEventsCommand } = require("@aws-sdk/client-personalize-events"); // CommonJS import
 * const client = new PersonalizeEventsClient(config);
 * const input = { // PutEventsRequest
 *   trackingId: "STRING_VALUE", // required
 *   userId: "STRING_VALUE",
 *   sessionId: "STRING_VALUE", // required
 *   eventList: [ // EventList // required
 *     { // Event
 *       eventId: "STRING_VALUE",
 *       eventType: "STRING_VALUE", // required
 *       eventValue: Number("float"),
 *       itemId: "STRING_VALUE",
 *       properties: "STRING_VALUE",
 *       sentAt: new Date("TIMESTAMP"), // required
 *       recommendationId: "STRING_VALUE",
 *       impression: [ // Impression
 *         "STRING_VALUE",
 *       ],
 *       metricAttribution: { // MetricAttribution
 *         eventAttributionSource: "STRING_VALUE", // required
 *       },
 *     },
 *   ],
 * };
 * const command = new PutEventsCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param PutEventsCommandInput - {@link PutEventsCommandInput}
 * @returns {@link PutEventsCommandOutput}
 * @see {@link PutEventsCommandInput} for command's `input` shape.
 * @see {@link PutEventsCommandOutput} for command's `response` shape.
 * @see {@link PersonalizeEventsClientResolvedConfig | config} for PersonalizeEventsClient's `config` shape.
 *
 * @throws {@link InvalidInputException} (client fault)
 *  <p>Provide a valid value for the field or parameter.</p>
 *
 * @throws {@link PersonalizeEventsServiceException}
 * <p>Base exception class for all service exceptions from PersonalizeEvents service.</p>
 *
 * @public
 */
export declare class PutEventsCommand extends PutEventsCommand_base {
}
