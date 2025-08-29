'use server';

/**
 * @fileOverview Suggests dynamic tip amounts to riders based on factors like the displayed fare, rider rating, and rider profile.
 *
 * - suggestDynamicTips - A function that suggests dynamic tip amounts.
 * - SuggestDynamicTipsInput - The input type for the suggestDynamicTips function.
 * - SuggestDynamicTipsOutput - The return type for the suggestDynamicTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDynamicTipsInputSchema = z.object({
  displayedFare: z.number().describe('The displayed fare for the ride.'),
  riderRating: z.number().describe('The rider rating (e.g., 4.5 out of 5).'),
  riderProfile: z
    .string()
    .describe(
      'A short description of the rider profile, including information such as whether they are a frequent rider or a new user.'
    ),
  travelConditions: z
    .string()
    .describe(
      'Description of the travel conditions (e.g., heavy traffic, smooth ride, etc.)'
    ),
});
export type SuggestDynamicTipsInput = z.infer<typeof SuggestDynamicTipsInputSchema>;

const SuggestDynamicTipsOutputSchema = z.object({
  suggestedTipAmounts: z
    .array(z.number())
    .describe('An array of suggested tip amounts in local currency.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested tip amounts, considering the input factors.'
    ),
});
export type SuggestDynamicTipsOutput = z.infer<typeof SuggestDynamicTipsOutputSchema>;

export async function suggestDynamicTips(
  input: SuggestDynamicTipsInput
): Promise<SuggestDynamicTipsOutput> {
  return suggestDynamicTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDynamicTipsPrompt',
  input: {schema: SuggestDynamicTipsInputSchema},
  output: {schema: SuggestDynamicTipsOutputSchema},
  prompt: `You are an expert in suggesting appropriate tip amounts for rideshare services.

  Based on the following information, suggest three tip amounts in local currency (Pakistani Rupees) and provide a brief explanation for your suggestions.

  Displayed Fare: {{{displayedFare}}} PKR
  Rider Rating: {{{riderRating}}}
  Rider Profile: {{{riderProfile}}}
  Travel Conditions: {{{travelConditions}}}

  Consider factors like excellent service, difficult travel conditions, and the rider's profile when determining the tip amounts. The suggested amounts should be reasonable and appealing to the rider.

  Output the suggested tip amounts and the reasoning in JSON format.
`,
});

const suggestDynamicTipsFlow = ai.defineFlow(
  {
    name: 'suggestDynamicTipsFlow',
    inputSchema: SuggestDynamicTipsInputSchema,
    outputSchema: SuggestDynamicTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
