
"use server";

import {
  suggestDynamicTips as suggestDynamicTipsFlow,
  type SuggestDynamicTipsInput,
  type SuggestDynamicTipsOutput,
} from "@/ai/flows/suggest-dynamic-tips";

export async function suggestDynamicTips(
  input: SuggestDynamicTipsInput
): Promise<SuggestDynamicTipsOutput> {
  return suggestDynamicTipsFlow(input);
}
