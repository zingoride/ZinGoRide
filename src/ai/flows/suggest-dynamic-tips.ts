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
import { getFirebaseAdmin } from '@/lib/firebase-admin';

// Tool to get user profile from Firestore
const getUserProfile = ai.defineTool(
  {
    name: 'getUserProfile',
    description: 'Returns the profile of a user from the database.',
    inputSchema: z.object({
      userId: z.string().describe('The ID of the user to fetch.'),
    }),
    outputSchema: z.object({
      name: z.string(),
      email: z.string(),
      type: z.string(),
      walletBalance: z.number(),
      approvalStatus: z.string().optional(),
    }),
  },
  async ({ userId }) => {
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    const userData = doc.data()!;
    return {
      name: userData.name || '',
      email: userData.email || '',
      type: userData.type || 'Customer',
      walletBalance: userData.walletBalance || 0,
      approvalStatus: userData.approvalStatus || undefined,
    };
  }
);


const SuggestDynamicTipsInputSchema = z.object({
  displayedFare: z.number().describe('The displayed fare for the ride.'),
  riderRating: z.number().describe('The rider rating (e.g., 4.5 out of 5).'),
  riderId: z.string().describe("The unique ID of the rider."),
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
  tools: [getUserProfile],
  prompt: `You are an expert in suggesting appropriate tip amounts for rideshare services.

  First, get the rider's profile using their ID.
  Rider ID: {{{riderId}}}

  Then, based on their profile and the following ride information, suggest three tip amounts in local currency (Pakistani Rupees) and provide a brief explanation for your suggestions.

  Displayed Fare: {{{displayedFare}}} PKR
  Rider Rating: {{{riderRating}}}
  Travel Conditions: {{{travelConditions}}}

  Consider factors like excellent service, difficult travel conditions, and the rider's profile (e.g., wallet balance, user type) when determining the tip amounts. The suggested amounts should be reasonable and appealing to the rider.

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
