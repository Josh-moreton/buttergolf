# Embedded onboarding

Provide your connected accounts a localized onboarding form that validates data.

Embedded onboarding is a themeable onboarding UI with limited Stripe branding. You embed the [Account onboarding component](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding.md) in your platform application, and your connected accounts interact with the embedded component without leaving your application.

# Accounts v2

> This is a Accounts v2 for when accounts-namespace is v2. View the full page at https://docs.stripe.com/connect/embedded-onboarding?accounts-namespace=v2.

Accounts v2 don’t support [networked onboarding](https://docs.stripe.com/connect/networked-onboarding.md). Owners of multiple Stripe accounts can’t automatically share business information between them.

Embedded onboarding uses the [Accounts v2 API](https://docs.stripe.com/api/v2/core/accounts.md?api-version=preview) to read the requirements and generate an onboarding form with data validation, localized for all Stripe-supported countries. In addition, embedded onboarding handles all:

- Business types
- Configurations of company representatives
- Verification document uploading
- Identity verification and statuses
- International bank accounts
- Error states

This demo lets you explore the embedded onboarding component’s interface:

Note: The following is a preview/demo component that behaves differently than live mode usage with real connected accounts. The actual component has more functionality than what might appear in this demo component. For example, for connected accounts without Stripe dashboard access (custom accounts), no user authentication is required in production.

## Create an account and configure information collection [Server-side]

For each connected account, use the Accounts v2 API to [create an Account object](https://docs.stripe.com/api/v2/core/accounts/create.md?api-version=2025-03-31.preview) with the `merchant` configuration. If you want to charge your connected accounts using subscriptions, also assign the `customer` configuration. To assign a configuration, simply include it in a create or update call. You don’t have to request any of its capabilities.

If you specify the account’s country or request any capabilities for it, then the account owner can’t change its country. Otherwise, it depends on the account’s Dashboard access:

- **Full Stripe Dashboard:** During onboarding, the account owner can select any acquiring country, the same as when signing up for a normal Stripe account. Stripe automatically requests a set of capabilities for the account based on the selected country.
- **Express Dashboard:** During onboarding, the account owner can select from a list of countries that you configure in your platform Dashboard [Onboarding options](https://dashboard.stripe.com/settings/connect/onboarding-options/countries). You can also configure those options to specify the default capabilities to request for accounts in each country.
- **No Stripe Dashboard**: If Stripe is responsible for collecting requirements, then the onboarding flow lets the account owner select any acquiring country. Otherwise, your custom onboarding flow must set the country and request capabilities.

> #### Use include to populate objects in the response
>
> When you create, retrieve, or update an `Account` in API v2, certain properties are only populated in the response if you specify them [in the include parameter](https://docs.stripe.com/connect/accounts-v2/api.md#include-pattern). For any of those properties that you don’t specify, the response includes them as null, regardless of their actual value.

```curl
curl -X POST https://api.stripe.com/v2/core/accounts \
  -H "Authorization: Bearer <<YOUR_SECRET_KEY>>" \
  -H "Stripe-Version: 2025-04-30.preview" \
  --json '{
    "contact_email": "furever_contact@example.com",
    "display_name": "Furever",
    "dashboard": "full",
    "identity": {
        "business_details": {
            "registered_name": "Furever"
        },
        "country": "us",
        "entity_type": "company"
    },
    "configuration": {
        "customer": {},
        "merchant": {
            "capabilities": {
                "card_payments": {
                    "requested": true
                }
            }
        }
    },
    "defaults": {
        "currency": "usd",
        "responsibilities": {
            "fees_collector": "stripe",
            "losses_collector": "stripe"
        },
        "locales": [
            "en-US"
        ]
    },
    "include": [
        "configuration.customer",
        "configuration.merchant",
        "identity",
        "requirements"
    ]
  }'
```

The response includes the ID, which you use to reference the `Account` throughout your integration.

### Request capabilities

You can request [capabilities](https://docs.stripe.com/connect/account-capabilities.md#creating) when creating an account by setting the desired capabilities’ `requested` property to true. For accounts with access to the Express Dashboard, you can also configure your [Onboarding options](https://dashboard.stripe.com/settings/connect/onboarding-options/countries) to automatically request certain capabilities when creating an account.

Stripe’s onboarding UIs automatically collect the requirements for requested capabilities. To reduce onboarding effort, request only the capabilities you need.

### Prefill information

If you have information about the account holder (like their name, address, or other details), you can simplify onboarding by providing it when you create or update the account. The onboarding interface asks the account holder to confirm the pre-filled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md). The account holder can edit any pre-filled information before they accept the service agreement, even if you provided the information using the Accounts API.

If you onboard an account and your platform provides it with a URL, prefill the account’s [defaults.profile.business_url](https://docs.stripe.com/api/v2/core/accounts/object.md?api-version=preview#v2_account_object-defaults-profile-business_url). If the business doesn’t have a URL, you can prefill its [defaults.profile.product_description](https://docs.stripe.com/api/v2/core/accounts/create.md?api-version=preview#v2_create_accounts-defaults-profile-product_description) instead.

When testing your integration, use [test data](https://docs.stripe.com/connect/testing.md) to simulate different outcomes including identity verification, business information verification, payout failures, and more.

### Collect a custom set of requirements

You can configure the embedded component to collect a specific set of requirements by using the `exclude` and `only` collection options. That allows you to build a custom flow for collecting certain requirements and use the embedded component for all other requirements. For example:

- Use `exclude` to prevent connected accounts from accessing the specified requirements through the component.
- Use `only` to restrict connected accounts to accessing only the specified requirements through the component.

For details about using these collection options, see the documentation for the [account onboarding component](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding.md#requirement-restrictions) or [account management component](https://docs.stripe.com/connect/supported-embedded-components/account-management.md#requirement-restrictions).

## Determine whether to collect all information up front

As the platform, you must decide if you want to collect the required information from your connected accounts _up front_ (Upfront onboarding is a type of onboarding where you collect all required verification information from your users at sign-up) or _incrementally_ (Incremental onboarding is a type of onboarding where you gradually collect required verification information from your users. You collect a minimum amount of information at sign-up, and you collect more information as the connected account earns more revenue). Up-front onboarding collects the `eventually_due` requirements for the account, while incremental onboarding only collects the `currently_due` requirements.

| Onboarding type | Advantages                                               |
| --------------- | -------------------------------------------------------- |
| **Up-front**    | - Normally requires only one request for all information |

- Avoids the possibility of payout and processing issues due to missed deadlines
- Exposes potential risk early when accounts refuse to provide information |
  | **Incremental** | - Accounts can onboard quickly because they don’t have to provide as much information |

To determine whether to use up-front or incremental onboarding, review the [requirements](https://docs.stripe.com/connect/required-verification-information.md) for your connected accounts’ locations and capabilities. While Stripe tries to minimize any impact to connected accounts, requirements might change over time.

For connected accounts where you’re responsible for requirement collection, you can customize the behavior of [future requirements](https://docs.stripe.com/connect/handle-verification-updates.md) using the `collection_options` parameter. To collect the account’s future requirements, set [collection_options.future_requirements](https://docs.stripe.com/api/v2/core/account-links/create.md?api-version=preview#create_account_links-collection_options-future_requirements) to `include`.

## Customize the policies shown to your users

Connected accounts see Stripe’s service agreement and [Privacy Policy](https://stripe.com/privacy) during embedded onboarding. Connected account users who haven’t [accepted Stripe’s services agreement](https://docs.stripe.com/connect/service-agreement-types.md#accepting-the-correct-agreement) must accept it on the final onboarding screen. Embedded onboarding also has a footer with links to Stripe’s service agreement and [Privacy Policy](https://stripe.com/privacy).

For connected accounts where the platform is responsible for requirement collection, you have additional options to customize the onboarding flow, as outlined below.

### Handle service agreement acceptance on your own

If you’re a platform onboarding connected accounts where you’re responsible for requirement collection, you can [collect Terms of Service acceptance](https://docs.stripe.com/connect/updating-service-agreements.md#tos-acceptance) using your own process instead of using the embedded account onboarding component. If using your own process, the final onboarding screen only asks your connected accounts to confirm the information they entered, and you must secure their acceptance of Stripe’s service agreement.

Embedded onboarding still has links to the terms of service (for example, in the footer) that you can replace by [linking to your own agreements and privacy policy](https://docs.stripe.com/connect/embedded-onboarding.md#link-to-your-own-agreements-and-privacy-policy).

### Link to your agreements and privacy policy

Connected accounts see the Stripe service agreement and [Privacy Policy](https://stripe.com/privacy) throughout embedded onboarding. For the connected accounts where you’re responsible for requirement collection, you can replace the links with your own agreements and policy. Follow the instructions to [incorporate the Stripe services agreement](https://docs.stripe.com/connect/updating-service-agreements.md#adding-stripes-service-agreement-to-your-terms-of-service) and [link to the Stripe Privacy Policy](https://docs.stripe.com/connect/updating-service-agreements.md#disclosing-how-stripe-processes-user-data).

## Integrate the account onboarding component [Server-side] [Client-side]

Create an [Account Session](https://docs.stripe.com/api/account_sessions.md) by specifying the ID of the connected account and `account_onboarding` as the component to enable.

## Create an Account Session

When [creating an Account Session](https://docs.stripe.com/api/account_sessions/create.md), enable account onboarding by specifying `account_onboarding` in the `components` parameter.

```curl
curl https://api.stripe.com/v1/account_sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  -d "components[account_onboarding][enabled]"=true
```

```cli
stripe account_sessions create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  -d "components[account_onboarding][enabled]"=true
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_session = client.v1.account_sessions.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  components: {account_onboarding: {enabled: true}},
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

# For SDK versions 12.4.0 or lower, remove '.v1' from the following line.
account_session = client.v1.account_sessions.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "components": {"account_onboarding": {"enabled": True}},
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountSession = $stripe->accountSessions->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'components' => ['account_onboarding' => ['enabled' => true]],
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountSessionCreateParams params =
  AccountSessionCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setComponents(
      AccountSessionCreateParams.Components.builder()
        .setAccountOnboarding(
          AccountSessionCreateParams.Components.AccountOnboarding.builder()
            .setEnabled(true)
            .build()
        )
        .build()
    )
    .build();

// For SDK versions 29.4.0 or lower, remove '.v1()' from the following line.
AccountSession accountSession = client.v1().accountSessions().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("<<YOUR_SECRET_KEY>>");

const accountSession = await stripe.accountSessions.create({
  account: "{{CONNECTEDACCOUNT_ID}}",
  components: {
    account_onboarding: {
      enabled: true,
    },
  },
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountSessionCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  Components: &stripe.AccountSessionCreateComponentsParams{
    AccountOnboarding: &stripe.AccountSessionCreateComponentsAccountOnboardingParams{
      Enabled: stripe.Bool(true),
    },
  },
}
result, err := sc.V1AccountSessions.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountSessionCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    Components = new AccountSessionComponentsOptions
    {
        AccountOnboarding = new AccountSessionComponentsAccountOnboardingOptions
        {
            Enabled = true,
        },
    },
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountSessions;
AccountSession accountSession = service.Create(options);
```

After creating the Account Session and [initializing ConnectJS](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions), you can render the Account onboarding component in the front end:

#### JavaScript

```js
// Include this element in your HTML
const accountOnboarding = stripeConnectInstance.create("account-onboarding");
accountOnboarding.setOnExit(() => {
  console.log("User exited the onboarding flow");
});
container.appendChild(accountOnboarding);

// Optional: make sure to follow our policy instructions above
// accountOnboarding.setFullTermsOfServiceUrl('{{URL}}')
// accountOnboarding.setRecipientTermsOfServiceUrl('{{URL}}')
// accountOnboarding.setPrivacyPolicyUrl('{{URL}}')
// accountOnboarding.setCollectionOptions({
//   fields: 'eventually_due',
//   futureRequirements: 'include',
// })
// accountOnboarding.setOnStepChange((stepChange) => {
//   console.log(`User entered: ${stepChange.step}`);
// });
```

#### React

```jsx
import * as React from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

const AccountOnboardingUI = () => {
  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => {
          console.log("The account has exited onboarding");
        }}
        // Optional: make sure to follow our policy instructions above
        // fullTermsOfServiceUrl="{{URL}}"
        // recipientTermsOfServiceUrl="{{URL}}"
        // privacyPolicyUrl="{{URL}}"
        // collectionOptions={{
        //   fields: 'eventually_due',
        //   futureRequirements: 'include',
        // }}
        // onStepChange={(stepChange) => {
        //   console.log(`User entered: ${stepChange.step}`);
        // }}
      />
    </ConnectComponentsProvider>
  );
};
```

#### HTML + JS

| Method                            | Type                           | Description                                                                                                                                                                                                                                                                                   | Default                                                                                    |
| --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `setFullTermsOfServiceUrl`        | `string`                       | Absolute URL to your [full terms of service](https://docs.stripe.com/connect/service-agreement-types.md#full) agreement.                                                                                                                                                                      | [Stripe’s full service agreement](https://stripe.com/connect-account/legal/full)           |
| `setRecipientTermsOfServiceUrl`   | `string`                       | Absolute URL to your [recipient terms of service](https://docs.stripe.com/connect/service-agreement-types.md#recipient) agreement.                                                                                                                                                            | [Stripe’s recipient service agreement](https://stripe.com/connect-account/legal/recipient) |
| `setPrivacyPolicyUrl`             | `string`                       | Absolute URL to your privacy policy.                                                                                                                                                                                                                                                          | [Stripe’s privacy policy](https://stripe.com/privacy)                                      |
| `setSkipTermsOfServiceCollection` | `string`                       | [DEPRECATED] Leverage requirement restriction `exclude: ["tos_acceptance.*"]` instead. If true, embedded onboarding skips terms of service collection and you must [collect terms acceptance yourself](https://docs.stripe.com/connect/updating-service-agreements.md#indicating-acceptance). | false                                                                                      |
| `setCollectionOptions`            | `{fields: 'currently_due'      | 'eventually_due', future_requirements: 'omit'                                                                                                                                                                                                                                                 | 'include', requirements: { exclude: string[] }                                             | { only: string[] }}` | Customizes collecting `currently_due` or `eventually_due` requirements, controls whether to include [future requirements](https://docs.stripe.com/api/accounts/object.md#account_object-future_requirements), and allows restricting requirements collection. Specifying `eventually_due` collects both `eventually_due` and `currently_due` requirements. | `{fields: 'currently_due', futureRequirements: 'omit'}` |
| `setOnExit`                       | `() => void`                   | The connected account has exited the onboarding process                                                                                                                                                                                                                                       |                                                                                            |
| `setOnStepChange`                 | `({step}: StepChange) => void` | The connected account has navigated from one step to another within the onboarding process. Use `StepChange` to identify the current step, as described below.                                                                                                                                |                                                                                            |

To use this component to set up new accounts:

1. Create a [connected account](https://docs.stripe.com/api/v2/core/accounts/create.md?api-version=2025-03-31.preview). You can prefill information on the `Account` object in this API call.
1. [Initialize Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions) using the ID of the connected account.
1. Include the `account-onboarding` element to show the onboarding flow to the connected account.
1. Listen for the `exit` event emitted from this component. Stripe sends this event when the connected account exits the onboarding process.
1. When `exit` triggers, retrieve the `Account` details to check the status of:
   - Requested `merchant` configuration capabilities, such as [card_payments.status](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=2025-03-31.preview#v2_retrieve_accounts-response-configuration-merchant-capabilities-card_payments-status)
   - Requested `recipient` configuration capabilities, such as [stripe_balance.stripe_transfers.status](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=2025-03-31.preview#v2_retrieve_accounts-response-configuration-recipient-capabilities-stripe_balance-stripe_transfers-status)
     If all required capabilities are enabled, you can take the connected account to the next step of your flow.

#### React

| React prop                     | Type                           | Description                                                                                                                                                                                                                                                                                   | Default                                                                                    | Required or Optional |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------- |
| `onExit`                       | `() => void`                   | The component executes this callback function when the connected account exits the onboarding process                                                                                                                                                                                         |                                                                                            | required             |
| `fullTermsOfServiceUrl`        | `string`                       | Link to your [full terms of service](https://docs.stripe.com/connect/service-agreement-types.md#full) agreement                                                                                                                                                                               | [Stripe’s full service agreement](https://stripe.com/connect-account/legal/full)           | optional             |
| `recipientTermsOfServiceUrl`   | `string`                       | Link to your [recipient terms of service](https://docs.stripe.com/connect/service-agreement-types.md#recipient) agreement                                                                                                                                                                     | [Stripe’s recipient service agreement](https://stripe.com/connect-account/legal/recipient) | optional             |
| `privacyPolicyUrl`             | `string`                       | Link to your privacy policy                                                                                                                                                                                                                                                                   | [Stripe’s privacy policy](https://stripe.com/privacy)                                      | optional             |
| `skipTermsOfServiceCollection` | `boolean`                      | [DEPRECATED] Leverage requirement restriction `exclude: ["tos_acceptance.*"]` instead. If true, embedded onboarding skips terms of service collection and you must [collect terms acceptance yourself](https://docs.stripe.com/connect/updating-service-agreements.md#indicating-acceptance). | false                                                                                      | optional             |
| `collectionOptions`            | `{fields: 'currently_due'      | 'eventually_due', futureRequirements?: 'omit'                                                                                                                                                                                                                                                 | 'include', requirements?: { exclude: string[] }                                            | { only: string[] }}` | Customizes collecting `currently_due` or `eventually_due` requirements, controls whether to include [future requirements](https://docs.stripe.com/api/accounts/object.md#account_object-future_requirements), and allows restricting requirements collection. Specifying `eventually_due` collects both `eventually_due` and `currently_due` requirements. You can’t update this parameter after the component has initially rendered. | `{fields: 'currently_due', futureRequirements: 'omit'}` | optional |
| `onStepChange`                 | `({step}: StepChange) => void` | The component executes this callback function when the connected account has navigated from one step to another within the onboarding process. Use `StepChange` to identify the current step, as described below.                                                                             |                                                                                            | optional             |

1. Create a [connected account](https://docs.stripe.com/api/v2/core/accounts/create.md?api-version=2025-03-31.preview). You can prefill information on the `Account` object in this API call.
1. [Initialize Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions) using the ID of the connected account.
1. Include the `account-onboarding` element to show the onboarding flow to the connected account.
1. Pass a callback function `onExit` to run when the connected account exits the onboarding process.
1. When `onExit` triggers, retrieve the `Account` details to check the status of:
   - Requested `merchant` configuration capabilities, such as [card_payments.status](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=2025-03-31.preview#v2_retrieve_accounts-response-configuration-merchant-capabilities-card_payments-status)
   - Requested `recipient` configuration capabilities, such as [stripe_balance.stripe_transfers.status](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=2025-03-31.preview#v2_retrieve_accounts-response-configuration-recipient-capabilities-stripe_balance-stripe_transfers-status)
     If all required capabilities are enabled, you can take the connected account to the next step of your flow.

### The StepChange object

The `StepChange` type is defined in `connect.js`. Every time the connected account navigates from one step to another in the onboarding process, the step change handler receives a `StepChange` object with the following property:

| Name   | Type                                 | Example value   |
| ------ | ------------------------------------ | --------------- | ------------------------------------------- |
| `step` | `string` (must be a valid step name) | `business_type` | The unique reference to an onboarding step. |

##### Step Restrictions

- The `StepChange` object is only for analytics.
- Steps can appear in any order and can repeat.
- The list of valid `step` names can change at any time, without notice.

#### Step Names

Each page in an onboarding flow has one of the following step names.

| Step name                                      | Description                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stripe_user_authentication`                   | [User authentication](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#user-authentication-in-connect-embedded-components) includes a popup to a Stripe-owned window. The connected account must authenticate before they can continue their workflow.                              |
| `risk_intervention`                            | Guides the connected account to resolve risk-related requirements.                                                                                                                                                                                                                                            |
| `legal_entity_sharing`                         | Not valid for connected accounts represented by Accounts v2, which can’t reuse business information from existing accounts with the same owner.                                                                                                                                                               |
| `business_type`                                | Sets the business type of the connected account. In certain cases the connected account can also set their country.                                                                                                                                                                                           |
| `business_details`                             | Collects information related to the connected account’s business.                                                                                                                                                                                                                                             |
| `business_verification`                        | Collects a proof of entity document establishing the business’ entity ID number, such as the company’s articles of incorporation. Or allows users to correct wrongly entered information related to the entity.                                                                                               |
| `business_bank_account_ownership_verification` | Collects documents needed to verify that bank account information, such as the legal owner’s name and account number, match the information on the user’s Stripe account.                                                                                                                                     |
| `business_documents`                           | Collects other documents and verification requirements related to the business.                                                                                                                                                                                                                               |
| `representative_details`                       | Collects information about the account representative.                                                                                                                                                                                                                                                        |
| `representative_document`                      | Collects a government-issued ID verifying the existence of the account representative.                                                                                                                                                                                                                        |
| `representative_additional_document`           | Collects an additional document to verifying the details of the account representative.                                                                                                                                                                                                                       |
| `legal_guardian_details`                       | Collects the legal guardians consent for accounts opened by minors.                                                                                                                                                                                                                                           |
| `owners`                                       | Collects information about the [beneficial owners](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                                              |
| `directors`                                    | Collects information about the [directors](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                                                      |
| `executives`                                   | Collects information about the [executives](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                                                     |
| `proof_of_ownership_document`                  | Collects documentation that verifies a company’s [beneficial owners](https://support.stripe.com/questions/beneficial-owner-and-director-definitions).                                                                                                                                                         |
| `proof_of_authorization`                       | Collects documentation to verify that the [account representative holds a position of sufficient authority](https://support.stripe.com/questions/representative-authority-verification) within a company.                                                                                                     |
| `confirm_owners`                               | Allows connected accounts to attest that the beneficial owner information provided to Stripe is both current and correct.                                                                                                                                                                                     |
| `risa_compliance_survey`                       | (Applies only to businesses in Japan.) Answers questions concerning the [Revised Installment Sales Act](https://stripe.com/guides/installment-sales-act).                                                                                                                                                     |
| `treasury_and_card_issuing_terms_of_service`   | Collects [Financial Accounts for platforms and Card Issuing](https://docs.stripe.com/financial-accounts/connect.md) terms of service when requesting those capabilities.                                                                                                                                      |
| `external_account`                             | Collects the [external account](https://docs.stripe.com/api/accounts/object.md#account_object-external_accounts) of the connected account. To access the external accounts for a connected account represented using Accounts v2, use the Accounts v1 endpoints.                                              |
| `support_details`                              | Collects information that helps customers recognize the connected accounts business. This support information can be visible in payment statements, invoices, and receipts.                                                                                                                                   |
| `climate`                                      | Allows a connected account to opt into [Stripe Climate](https://docs.stripe.com/climate.md).                                                                                                                                                                                                                  |
| `tax`                                          | Allows a connected account to opt into [Stripe Tax](https://docs.stripe.com/tax.md).                                                                                                                                                                                                                          |
| `summary`                                      | Final review step of onboarding. The connected account can update entered information from this step. The terms of service and privacy URL is displayed in this screen.                                                                                                                                       |
| `summary_risk`                                 | From the summary step, a connected account can update information related to risk requirements.                                                                                                                                                                                                               |
| `summary_business_type`                        | From the summary step, a connected account can update information related to their business type.                                                                                                                                                                                                             |
| `summary_business`                             | From the summary step, a connected account can update information related to their business.                                                                                                                                                                                                                  |
| `summary_support`                              | From the summary step, a connected account can update public-facing information related to their business.                                                                                                                                                                                                    |
| `summary_persons`                              | From the summary step, a connected account can update information about each person on their account.                                                                                                                                                                                                         |
| `summary_external_account`                     | From the summary step, a connected account can update information related to their [external account](https://docs.stripe.com/api/accounts/object.md#account_object-external_accounts). To access the external accounts for a connected account represented using Accounts v2, use the Accounts v1 endpoints. |
| `summary_tax`                                  | From the summary step, a connected account can update information related to their [Stripe Tax](https://docs.stripe.com/tax.md) integration.                                                                                                                                                                  |
| `summary_tax_identification_form`              | From the summary step, a connected account can update information related to their W8/W9 certified tax information. This is shown when Stripe must collect W8/W9 information.                                                                                                                                 |
| `summary_climate`                              | From the summary step, a connected account can update information related to their [Stripe Climate](https://docs.stripe.com/climate.md) integration.                                                                                                                                                          |
| `terms_of_service`                             | When leveraging requirement restrictions to collect `only` ToS acceptance, we render a special step because the summary step is not rendered when leveraging `only` requirement restrictions.                                                                                                                 |

## Identify and address requirement updates [Server-side]

Set up your integration to [listen for changes](https://docs.stripe.com/connect/handling-api-verification.md#verification-process) to account requirements. You can test handling new requirements (and how they might disable charges and payouts) with the [test trigger cards](https://docs.stripe.com/connect/testing.md#trigger-cards).

Send a connected account back through onboarding when it has any `currently_due` or `eventually_due` requirements. You don’t need to identify the specific requirements, because the onboarding interface knows what information it needs to collect. For example, if a typo is preventing verification of the account owner’s identity, onboarding prompts them to upload an identity document.

Stripe notifies you about any [upcoming requirements updates](https://support.stripe.com/user/questions/onboarding-requirements-updates) that affect your connected accounts. You can proactively collect this information by reviewing your accounts’ requirements that have a [requested_reasons.code](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=preview#v2_retrieve_accounts-response-requirements-entries-requested_reasons-code) of `future_requirements`.

For connected accounts where Stripe is responsible for collecting requirements, stop receiving updates for identity information after creating an [Account Link](https://docs.stripe.com/api/v2/core/account-links.md?api-version=preview) or [Account Session](https://docs.stripe.com/api/account_sessions.md).

Accounts store identity information in the `identity` hash.

### Handle verification errors

Listen to the [v2.core.account[requirements].updated](https://docs.stripe.com/api/v2/core/events/event-types.md?api-version=preview) event. If the account contains any requirements with a [minimum_deadline.status](https://docs.stripe.com/api/v2/core/accounts/retrieve.md?api-version=preview#v2_retrieve_accounts-response-requirements-entries-minimum_deadline-status) of `currently_due` when the deadline arrives, the corresponding functionality is disabled and those statuses become `past_due`.

Let your accounts remediate their verification requirements by directing them to the [Account onboarding component](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding.md).
(See full diagram at https://docs.stripe.com/connect/embedded-onboarding)

### Disable Stripe user authentication

When using embedded onboarding, [Stripe user authentication](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#user-authentication-in-connect-embedded-components) is enabled by default. You can use [`disable_stripe_user_authentication`](https://docs.stripe.com/api/account_sessions/create.md#create_account_session-components-account_onboarding-features-disable_stripe_user_authentication) to remove this behavior.

We recommend implementing two-factor authentication or equivalent security measures as a [best practice](https://docs.stripe.com/connect/risk-management/best-practices.md#prevent-account-take-overs). For account configurations that support this feature, such as Custom, you assume liability for connected accounts if they can’t pay back [negative balances](https://docs.stripe.com/connect/risk-management/best-practices.md#decide-your-approach-to-negative-balance-liability).

# Accounts v1

> This is a Accounts v1 for when accounts-namespace is v1. View the full page at https://docs.stripe.com/connect/embedded-onboarding?accounts-namespace=v1.

The component supports [networked onboarding](https://docs.stripe.com/connect/networked-onboarding.md), which allows owners of multiple Stripe accounts to share business information between them. When they onboard an account, they can reuse that information from an existing account instead of resubmitting it.

Embedded onboarding uses the [Accounts API](https://docs.stripe.com/api/accounts.md) to read the requirements and generate an onboarding form with data validation, localized for all Stripe-supported countries. In addition, embedded onboarding handles all:

- Business types
- Configurations of company representatives
- Verification document uploading
- Identity verification and statuses
- International bank accounts
- Error states

This demo lets you explore the embedded onboarding component’s interface:

Note: The following is a preview/demo component that behaves differently than live mode usage with real connected accounts. The actual component has more functionality than what might appear in this demo component. For example, for connected accounts without Stripe dashboard access (custom accounts), no user authentication is required in production.

## Create an account and configure information collection [Server-side]

Create a [connected account](https://docs.stripe.com/api/accounts.md) with the default [controller](https://docs.stripe.com/api/accounts/create.md#create_account-controller) properties. See [design an integration](https://docs.stripe.com/connect/design-an-integration.md) to learn more about controller properties. Alternatively, you can create a connected account by specifying an account [type](https://docs.stripe.com/api/accounts/create.md#create_account-type).

If you specify the account’s country or request any capabilities for it, then the account owner can’t change its country. Otherwise, it depends on the account’s Dashboard access:

- **Full Stripe Dashboard:** During onboarding, the account owner can select any acquiring country, the same as when signing up for a normal Stripe account. Stripe automatically requests a set of capabilities for the account based on the selected country.
- **Express Dashboard:** During onboarding, the account owner can select from a list of countries that you configure in your platform Dashboard [Onboarding options](https://dashboard.stripe.com/settings/connect/onboarding-options/countries). You can also configure those options to specify the default capabilities to request for accounts in each country.
- **No Stripe Dashboard**: If Stripe is responsible for collecting requirements, then the onboarding flow lets the account owner select any acquiring country. Otherwise, your custom onboarding flow must set the country and request capabilities.

#### With controller properties

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "controller[fees][payer]"=application \
  -d "controller[losses][payments]"=application \
  -d "controller[stripe_dashboard][type]"=express
```

```cli
stripe accounts create  \
  -d "controller[fees][payer]"=application \
  -d "controller[losses][payments]"=application \
  -d "controller[stripe_dashboard][type]"=express
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({
  controller: {
    fees: {payer: 'application'},
    losses: {payments: 'application'},
    stripe_dashboard: {type: 'express'},
  },
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

# For SDK versions 12.4.0 or lower, remove '.v1' from the following line.
account = client.v1.accounts.create({
  "controller": {
    "fees": {"payer": "application"},
    "losses": {"payments": "application"},
    "stripe_dashboard": {"type": "express"},
  },
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([
  'controller' => [
    'fees' => ['payer' => 'application'],
    'losses' => ['payments' => 'application'],
    'stripe_dashboard' => ['type' => 'express'],
  ],
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder()
    .setController(
      AccountCreateParams.Controller.builder()
        .setFees(
          AccountCreateParams.Controller.Fees.builder()
            .setPayer(AccountCreateParams.Controller.Fees.Payer.APPLICATION)
            .build()
        )
        .setLosses(
          AccountCreateParams.Controller.Losses.builder()
            .setPayments(AccountCreateParams.Controller.Losses.Payments.APPLICATION)
            .build()
        )
        .setStripeDashboard(
          AccountCreateParams.Controller.StripeDashboard.builder()
            .setType(AccountCreateParams.Controller.StripeDashboard.Type.EXPRESS)
            .build()
        )
        .build()
    )
    .build();

// For SDK versions 29.4.0 or lower, remove '.v1()' from the following line.
Account account = client.v1().accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("<<YOUR_SECRET_KEY>>");

const account = await stripe.accounts.create({
  controller: {
    fees: {
      payer: "application",
    },
    losses: {
      payments: "application",
    },
    stripe_dashboard: {
      type: "express",
    },
  },
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{
  Controller: &stripe.AccountCreateControllerParams{
    Fees: &stripe.AccountCreateControllerFeesParams{
      Payer: stripe.String(stripe.AccountControllerFeesPayerApplication),
    },
    Losses: &stripe.AccountCreateControllerLossesParams{
      Payments: stripe.String(stripe.AccountControllerLossesPaymentsApplication),
    },
    StripeDashboard: &stripe.AccountCreateControllerStripeDashboardParams{
      Type: stripe.String(stripe.AccountControllerStripeDashboardTypeExpress),
    },
  },
}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions
{
    Controller = new AccountControllerOptions
    {
        Fees = new AccountControllerFeesOptions { Payer = "application" },
        Losses = new AccountControllerLossesOptions { Payments = "application" },
        StripeDashboard = new AccountControllerStripeDashboardOptions
        {
            Type = "express",
        },
    },
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

# For SDK versions 12.4.0 or lower, remove '.v1' from the following line.
account = client.v1.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

// For SDK versions 29.4.0 or lower, remove '.v1()' from the following line.
Account account = client.v1().accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("<<YOUR_SECRET_KEY>>");

const account = await stripe.accounts.create({
  type: "standard",
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

The response includes the ID, which you use to reference the `Account` throughout your integration.

### Request capabilities

You can request [capabilities](https://docs.stripe.com/connect/account-capabilities.md#creating) when creating an account by setting the desired capabilities’ `requested` property to true. For accounts with access to the Express Dashboard, you can also configure your [Onboarding options](https://dashboard.stripe.com/settings/connect/onboarding-options/countries) to automatically request certain capabilities when creating an account.

Stripe’s onboarding UIs automatically collect the requirements for requested capabilities. To reduce onboarding effort, request only the capabilities you need.

### Prefill information

If you have information about the account holder (like their name, address, or other details), you can simplify onboarding by providing it when you create or update the account. The onboarding interface asks the account holder to confirm the pre-filled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md). The account holder can edit any pre-filled information before they accept the service agreement, even if you provided the information using the Accounts API.

If you onboard an account and your platform provides it with a URL, prefill the account’s [business_profile.url](https://docs.stripe.com/api/accounts/create.md#create_account-business_profile-url). If the business doesn’t have a URL, you can prefill its [business_profile.product_description](https://docs.stripe.com/api/accounts/create.md#create_account-business_profile-product_description) instead.

When testing your integration, use [test data](https://docs.stripe.com/connect/testing.md) to simulate different outcomes including identity verification, business information verification, payout failures, and more.

### Collect a custom set of requirements

You can configure the embedded component to collect a specific set of requirements by using the `exclude` and `only` collection options. That allows you to build a custom flow for collecting certain requirements and use the embedded component for all other requirements. For example:

- Use `exclude` to prevent connected accounts from accessing the specified requirements through the component.
- Use `only` to restrict connected accounts to accessing only the specified requirements through the component.

For details about using these collection options, see the documentation for the [account onboarding component](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding.md#requirement-restrictions) or [account management component](https://docs.stripe.com/connect/supported-embedded-components/account-management.md#requirement-restrictions).

## Determine whether to collect all information up front

As the platform, you must decide if you want to collect the required information from your connected accounts _up front_ (Upfront onboarding is a type of onboarding where you collect all required verification information from your users at sign-up) or _incrementally_ (Incremental onboarding is a type of onboarding where you gradually collect required verification information from your users. You collect a minimum amount of information at sign-up, and you collect more information as the connected account earns more revenue). Up-front onboarding collects the `eventually_due` requirements for the account, while incremental onboarding only collects the `currently_due` requirements.

| Onboarding type | Advantages                                               |
| --------------- | -------------------------------------------------------- |
| **Up-front**    | - Normally requires only one request for all information |

- Avoids the possibility of payout and processing issues due to missed deadlines
- Exposes potential risk early when accounts refuse to provide information |
  | **Incremental** | - Accounts can onboard quickly because they don’t have to provide as much information |

To determine whether to use up-front or incremental onboarding, review the [requirements](https://docs.stripe.com/connect/required-verification-information.md) for your connected accounts’ locations and capabilities. While Stripe tries to minimize any impact to connected accounts, requirements might change over time.

For connected accounts where you’re responsible for requirement collection, you can customize the behavior of [future requirements](https://docs.stripe.com/connect/handle-verification-updates.md) using the `collection_options` parameter. To collect the account’s future requirements, set [`collection_options.future_requirements`](https://docs.stripe.com/api/account_links/create.md#create_account_link-collection_options-future_requirements) to `include`.

## Customize the policies shown to your users

Connected accounts see Stripe’s service agreement and [Privacy Policy](https://stripe.com/privacy) during embedded onboarding. Connected account users who haven’t [accepted Stripe’s services agreement](https://docs.stripe.com/connect/service-agreement-types.md#accepting-the-correct-agreement) must accept it on the final onboarding screen. Embedded onboarding also has a footer with links to Stripe’s service agreement and [Privacy Policy](https://stripe.com/privacy).

For connected accounts where the platform is responsible for requirement collection, you have additional options to customize the onboarding flow, as outlined below.

### Handle service agreement acceptance on your own

If you’re a platform onboarding connected accounts where you’re responsible for requirement collection, you can [collect Terms of Service acceptance](https://docs.stripe.com/connect/updating-service-agreements.md#tos-acceptance) using your own process instead of using the embedded account onboarding component. If using your own process, the final onboarding screen only asks your connected accounts to confirm the information they entered, and you must secure their acceptance of Stripe’s service agreement.

Embedded onboarding still has links to the terms of service (for example, in the footer) that you can replace by [linking to your own agreements and privacy policy](https://docs.stripe.com/connect/embedded-onboarding.md#link-to-your-own-agreements-and-privacy-policy).

### Link to your agreements and privacy policy

Connected accounts see the Stripe service agreement and [Privacy Policy](https://stripe.com/privacy) throughout embedded onboarding. For the connected accounts where you’re responsible for requirement collection, you can replace the links with your own agreements and policy. Follow the instructions to [incorporate the Stripe services agreement](https://docs.stripe.com/connect/updating-service-agreements.md#adding-stripes-service-agreement-to-your-terms-of-service) and [link to the Stripe Privacy Policy](https://docs.stripe.com/connect/updating-service-agreements.md#disclosing-how-stripe-processes-user-data).

## Integrate the account onboarding component [Server-side] [Client-side]

Create an [Account Session](https://docs.stripe.com/api/account_sessions.md) by specifying the ID of the connected account and `account_onboarding` as the component to enable.

## Create an Account Session

When [creating an Account Session](https://docs.stripe.com/api/account_sessions/create.md), enable account onboarding by specifying `account_onboarding` in the `components` parameter.

```curl
curl https://api.stripe.com/v1/account_sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  -d "components[account_onboarding][enabled]"=true
```

```cli
stripe account_sessions create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  -d "components[account_onboarding][enabled]"=true
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_session = client.v1.account_sessions.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  components: {account_onboarding: {enabled: true}},
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

# For SDK versions 12.4.0 or lower, remove '.v1' from the following line.
account_session = client.v1.account_sessions.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "components": {"account_onboarding": {"enabled": True}},
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountSession = $stripe->accountSessions->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'components' => ['account_onboarding' => ['enabled' => true]],
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountSessionCreateParams params =
  AccountSessionCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setComponents(
      AccountSessionCreateParams.Components.builder()
        .setAccountOnboarding(
          AccountSessionCreateParams.Components.AccountOnboarding.builder()
            .setEnabled(true)
            .build()
        )
        .build()
    )
    .build();

// For SDK versions 29.4.0 or lower, remove '.v1()' from the following line.
AccountSession accountSession = client.v1().accountSessions().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")("<<YOUR_SECRET_KEY>>");

const accountSession = await stripe.accountSessions.create({
  account: "{{CONNECTEDACCOUNT_ID}}",
  components: {
    account_onboarding: {
      enabled: true,
    },
  },
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountSessionCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  Components: &stripe.AccountSessionCreateComponentsParams{
    AccountOnboarding: &stripe.AccountSessionCreateComponentsAccountOnboardingParams{
      Enabled: stripe.Bool(true),
    },
  },
}
result, err := sc.V1AccountSessions.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountSessionCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    Components = new AccountSessionComponentsOptions
    {
        AccountOnboarding = new AccountSessionComponentsAccountOnboardingOptions
        {
            Enabled = true,
        },
    },
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountSessions;
AccountSession accountSession = service.Create(options);
```

After creating the Account Session and [initializing ConnectJS](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions), you can render the Account onboarding component in the front end:

#### JavaScript

```js
// Include this element in your HTML
const accountOnboarding = stripeConnectInstance.create("account-onboarding");
accountOnboarding.setOnExit(() => {
  console.log("User exited the onboarding flow");
});
container.appendChild(accountOnboarding);

// Optional: make sure to follow our policy instructions above
// accountOnboarding.setFullTermsOfServiceUrl('{{URL}}')
// accountOnboarding.setRecipientTermsOfServiceUrl('{{URL}}')
// accountOnboarding.setPrivacyPolicyUrl('{{URL}}')
// accountOnboarding.setCollectionOptions({
//   fields: 'eventually_due',
//   futureRequirements: 'include',
// })
// accountOnboarding.setOnStepChange((stepChange) => {
//   console.log(`User entered: ${stepChange.step}`);
// });
```

#### React

```jsx
import * as React from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

const AccountOnboardingUI = () => {
  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => {
          console.log("The account has exited onboarding");
        }}
        // Optional: make sure to follow our policy instructions above
        // fullTermsOfServiceUrl="{{URL}}"
        // recipientTermsOfServiceUrl="{{URL}}"
        // privacyPolicyUrl="{{URL}}"
        // collectionOptions={{
        //   fields: 'eventually_due',
        //   futureRequirements: 'include',
        // }}
        // onStepChange={(stepChange) => {
        //   console.log(`User entered: ${stepChange.step}`);
        // }}
      />
    </ConnectComponentsProvider>
  );
};
```

#### HTML + JS

| Method                            | Type                           | Description                                                                                                                                                                                                                                                                                   | Default                                                                                    |
| --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `setFullTermsOfServiceUrl`        | `string`                       | Absolute URL to your [full terms of service](https://docs.stripe.com/connect/service-agreement-types.md#full) agreement.                                                                                                                                                                      | [Stripe’s full service agreement](https://stripe.com/connect-account/legal/full)           |
| `setRecipientTermsOfServiceUrl`   | `string`                       | Absolute URL to your [recipient terms of service](https://docs.stripe.com/connect/service-agreement-types.md#recipient) agreement.                                                                                                                                                            | [Stripe’s recipient service agreement](https://stripe.com/connect-account/legal/recipient) |
| `setPrivacyPolicyUrl`             | `string`                       | Absolute URL to your privacy policy.                                                                                                                                                                                                                                                          | [Stripe’s privacy policy](https://stripe.com/privacy)                                      |
| `setSkipTermsOfServiceCollection` | `string`                       | [DEPRECATED] Leverage requirement restriction `exclude: ["tos_acceptance.*"]` instead. If true, embedded onboarding skips terms of service collection and you must [collect terms acceptance yourself](https://docs.stripe.com/connect/updating-service-agreements.md#indicating-acceptance). | false                                                                                      |
| `setCollectionOptions`            | `{fields: 'currently_due'      | 'eventually_due', future_requirements: 'omit'                                                                                                                                                                                                                                                 | 'include', requirements: { exclude: string[] }                                             | { only: string[] }}` | Customizes collecting `currently_due` or `eventually_due` requirements, controls whether to include [future requirements](https://docs.stripe.com/api/accounts/object.md#account_object-future_requirements), and allows restricting requirements collection. Specifying `eventually_due` collects both `eventually_due` and `currently_due` requirements. | `{fields: 'currently_due', futureRequirements: 'omit'}` |
| `setOnExit`                       | `() => void`                   | The connected account has exited the onboarding process                                                                                                                                                                                                                                       |                                                                                            |
| `setOnStepChange`                 | `({step}: StepChange) => void` | The connected account has navigated from one step to another within the onboarding process. Use `StepChange` to identify the current step, as described below.                                                                                                                                |                                                                                            |

To use this component to set up new accounts:

1. Create a [connected account](https://docs.stripe.com/api/accounts/create.md). You can prefill information on the `Account` object in this API call.
1. [Initialize Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions) using the ID of the connected account.
1. Include the `account-onboarding` element to show the onboarding flow to the connected account.
1. Listen for the `exit` event emitted from this component. Stripe sends this event when the connected account exits the onboarding process.
1. When `exit` triggers, retrieve the `Account` details to check the status of:
   - [details_submitted](https://docs.stripe.com/api/accounts/object.md#account_object-details_submitted)
   - [charges_enabled](https://docs.stripe.com/api/accounts/object.md#account_object-charges_enabled)
   - [payouts_enabled](https://docs.stripe.com/api/accounts/object.md#account_object-payouts_enabled)
   - Any other requested capabilities
     If all required capabilities are enabled, you can take the connected account to the next step of your flow.

#### React

| React prop                     | Type                           | Description                                                                                                                                                                                                                                                                                   | Default                                                                                    | Required or Optional |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------- |
| `onExit`                       | `() => void`                   | The component executes this callback function when the connected account exits the onboarding process                                                                                                                                                                                         |                                                                                            | required             |
| `fullTermsOfServiceUrl`        | `string`                       | Link to your [full terms of service](https://docs.stripe.com/connect/service-agreement-types.md#full) agreement                                                                                                                                                                               | [Stripe’s full service agreement](https://stripe.com/connect-account/legal/full)           | optional             |
| `recipientTermsOfServiceUrl`   | `string`                       | Link to your [recipient terms of service](https://docs.stripe.com/connect/service-agreement-types.md#recipient) agreement                                                                                                                                                                     | [Stripe’s recipient service agreement](https://stripe.com/connect-account/legal/recipient) | optional             |
| `privacyPolicyUrl`             | `string`                       | Link to your privacy policy                                                                                                                                                                                                                                                                   | [Stripe’s privacy policy](https://stripe.com/privacy)                                      | optional             |
| `skipTermsOfServiceCollection` | `boolean`                      | [DEPRECATED] Leverage requirement restriction `exclude: ["tos_acceptance.*"]` instead. If true, embedded onboarding skips terms of service collection and you must [collect terms acceptance yourself](https://docs.stripe.com/connect/updating-service-agreements.md#indicating-acceptance). | false                                                                                      | optional             |
| `collectionOptions`            | `{fields: 'currently_due'      | 'eventually_due', futureRequirements?: 'omit'                                                                                                                                                                                                                                                 | 'include', requirements?: { exclude: string[] }                                            | { only: string[] }}` | Customizes collecting `currently_due` or `eventually_due` requirements, controls whether to include [future requirements](https://docs.stripe.com/api/accounts/object.md#account_object-future_requirements), and allows restricting requirements collection. Specifying `eventually_due` collects both `eventually_due` and `currently_due` requirements. You can’t update this parameter after the component has initially rendered. | `{fields: 'currently_due', futureRequirements: 'omit'}` | optional |
| `onStepChange`                 | `({step}: StepChange) => void` | The component executes this callback function when the connected account has navigated from one step to another within the onboarding process. Use `StepChange` to identify the current step, as described below.                                                                             |                                                                                            | optional             |

1. Create a [connected account](https://docs.stripe.com/api/accounts/create.md). You can prefill information on the `Account` object in this API call.
1. [Initialize Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#account-sessions) using the ID of the connected account.
1. Include the `account-onboarding` element to show the onboarding flow to the connected account.
1. Pass a callback function `onExit` to run when the connected account exits the onboarding process.
1. When `onExit` triggers, retrieve the `Account` details to check the status of:
   - [details_submitted](https://docs.stripe.com/api/accounts/object.md#account_object-details_submitted)
   - [charges_enabled](https://docs.stripe.com/api/accounts/object.md#account_object-charges_enabled)
   - [payouts_enabled](https://docs.stripe.com/api/accounts/object.md#account_object-payouts_enabled)
   - Any other requested capabilities
     If all required capabilities are enabled, you can take the connected account to the next step of your flow.

### The StepChange object

The `StepChange` type is defined in `connect.js`. Every time the connected account navigates from one step to another in the onboarding process, the step change handler receives a `StepChange` object with the following property:

| Name   | Type                                 | Example value   |
| ------ | ------------------------------------ | --------------- | ------------------------------------------- |
| `step` | `string` (must be a valid step name) | `business_type` | The unique reference to an onboarding step. |

##### Step Restrictions

- The `StepChange` object is only for analytics.
- Steps can appear in any order and can repeat.
- The list of valid `step` names can change at any time, without notice.

#### Step Names

Each page in an onboarding flow has one of the following step names.

| Step name                                      | Description                                                                                                                                                                                                                                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stripe_user_authentication`                   | [User authentication](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#user-authentication-in-connect-embedded-components) includes a popup to a Stripe-owned window. The connected account must authenticate before they can continue their workflow. |
| `risk_intervention`                            | Guides the connected account to resolve risk-related requirements.                                                                                                                                                                                                               |
| `legal_entity_sharing`                         | Connected accounts can optionally [reuse business information](https://docs.stripe.com/connect/networked-onboarding.md) from existing accounts with the same owner.                                                                                                              |
| `business_type`                                | Sets the business type of the connected account. In certain cases the connected account can also set their country.                                                                                                                                                              |
| `business_details`                             | Collects information related to the connected account’s business.                                                                                                                                                                                                                |
| `business_verification`                        | Collects a proof of entity document establishing the business’ entity ID number, such as the company’s articles of incorporation. Or allows users to correct wrongly entered information related to the entity.                                                                  |
| `business_bank_account_ownership_verification` | Collects documents needed to verify that bank account information, such as the legal owner’s name and account number, match the information on the user’s Stripe account.                                                                                                        |
| `business_documents`                           | Collects other documents and verification requirements related to the business.                                                                                                                                                                                                  |
| `representative_details`                       | Collects information about the account representative.                                                                                                                                                                                                                           |
| `representative_document`                      | Collects a government-issued ID verifying the existence of the account representative.                                                                                                                                                                                           |
| `representative_additional_document`           | Collects an additional document to verifying the details of the account representative.                                                                                                                                                                                          |
| `legal_guardian_details`                       | Collects the legal guardians consent for accounts opened by minors.                                                                                                                                                                                                              |
| `owners`                                       | Collects information about the [beneficial owners](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                 |
| `directors`                                    | Collects information about the [directors](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                         |
| `executives`                                   | Collects information about the [executives](https://support.stripe.com/questions/beneficial-owner-and-director-definitions) of a company.                                                                                                                                        |
| `proof_of_ownership_document`                  | Collects documentation that verifies a company’s [beneficial owners](https://support.stripe.com/questions/beneficial-owner-and-director-definitions).                                                                                                                            |
| `proof_of_authorization`                       | Collects documentation to verify that the [account representative holds a position of sufficient authority](https://support.stripe.com/questions/representative-authority-verification) within a company.                                                                        |
| `confirm_owners`                               | Allows connected accounts to attest that the beneficial owner information provided to Stripe is both current and correct.                                                                                                                                                        |
| `risa_compliance_survey`                       | (Applies only to businesses in Japan.) Answers questions concerning the [Revised Installment Sales Act](https://stripe.com/guides/installment-sales-act).                                                                                                                        |
| `treasury_and_card_issuing_terms_of_service`   | Collects [Financial Accounts for platforms and Card Issuing](https://docs.stripe.com/financial-accounts/connect.md) terms of service when requesting those capabilities.                                                                                                         |
| `external_account`                             | Collects the [external account](https://docs.stripe.com/api/accounts/object.md#account_object-external_accounts) of the connected account.                                                                                                                                       |
| `support_details`                              | Collects information that helps customers recognize the connected accounts business. This support information can be visible in payment statements, invoices, and receipts.                                                                                                      |
| `climate`                                      | Allows a connected account to opt into [Stripe Climate](https://docs.stripe.com/climate.md).                                                                                                                                                                                     |
| `tax`                                          | Allows a connected account to opt into [Stripe Tax](https://docs.stripe.com/tax.md).                                                                                                                                                                                             |
| `summary`                                      | Final review step of onboarding. The connected account can update entered information from this step. The terms of service and privacy URL is displayed in this screen.                                                                                                          |
| `summary_risk`                                 | From the summary step, a connected account can update information related to risk requirements.                                                                                                                                                                                  |
| `summary_business_type`                        | From the summary step, a connected account can update information related to their business type.                                                                                                                                                                                |
| `summary_business`                             | From the summary step, a connected account can update information related to their business.                                                                                                                                                                                     |
| `summary_support`                              | From the summary step, a connected account can update public-facing information related to their business.                                                                                                                                                                       |
| `summary_persons`                              | From the summary step, a connected account can update information about each person on their account.                                                                                                                                                                            |
| `summary_external_account`                     | From the summary step, a connected account can update information related to their [external account](https://docs.stripe.com/api/accounts/object.md#account_object-external_accounts).                                                                                          |
| `summary_tax`                                  | From the summary step, a connected account can update information related to their [Stripe Tax](https://docs.stripe.com/tax.md) integration.                                                                                                                                     |
| `summary_tax_identification_form`              | From the summary step, a connected account can update information related to their W8/W9 certified tax information. This is shown when Stripe must collect W8/W9 information.                                                                                                    |
| `summary_climate`                              | From the summary step, a connected account can update information related to their [Stripe Climate](https://docs.stripe.com/climate.md) integration.                                                                                                                             |
| `terms_of_service`                             | When leveraging requirement restrictions to collect `only` ToS acceptance, we render a special step because the summary step is not rendered when leveraging `only` requirement restrictions.                                                                                    |

## Identify and address requirement updates [Server-side]

Set up your integration to [listen for changes](https://docs.stripe.com/connect/handling-api-verification.md#verification-process) to account requirements. You can test handling new requirements (and how they might disable charges and payouts) with the [test trigger cards](https://docs.stripe.com/connect/testing.md#trigger-cards).

Send a connected account back through onboarding when it has any `currently_due` or `eventually_due` requirements. You don’t need to identify the specific requirements, because the onboarding interface knows what information it needs to collect. For example, if a typo is preventing verification of the account owner’s identity, onboarding prompts them to upload an identity document.

Stripe notifies you about any [upcoming requirements updates](https://support.stripe.com/user/questions/onboarding-requirements-updates) that affect your connected accounts. You can proactively collect this information by reviewing the [future requirements](https://docs.stripe.com/api/accounts/object.md#account_object-future_requirements) for your accounts.

For connected accounts where [controller.requirement_collection](https://docs.stripe.com/api/accounts/object.md#account_object-controller-requirement_collection) is `stripe`, stop receiving updates for identity information after creating an [Account Link](https://docs.stripe.com/api/account_links.md) or [Account Session](https://docs.stripe.com/api/account_sessions.md).

Accounts store identity information in the `company` and `individual` hashes.

### Handle verification errors

Listen to the [account.updated](https://docs.stripe.com/api/events/types.md#event_types-account.updated) event. If the account contains any `currently_due` fields when the `current_deadline` arrives, the corresponding functionality is disabled and those fields are added to `past_due`.

Let your accounts remediate their verification requirements by directing them to the [Account onboarding component](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding.md).
(See full diagram at https://docs.stripe.com/connect/embedded-onboarding)

### Disable Stripe user authentication

When using embedded onboarding, [Stripe user authentication](https://docs.stripe.com/connect/get-started-connect-embedded-components.md#user-authentication-in-connect-embedded-components) is enabled by default. You can use [`disable_stripe_user_authentication`](https://docs.stripe.com/api/account_sessions/create.md#create_account_session-components-account_onboarding-features-disable_stripe_user_authentication) to remove this behavior.

We recommend implementing two-factor authentication or equivalent security measures as a [best practice](https://docs.stripe.com/connect/risk-management/best-practices.md#prevent-account-take-overs). For account configurations that support this feature, such as Custom, you assume liability for connected accounts if they can’t pay back [negative balances](https://docs.stripe.com/connect/risk-management/best-practices.md#decide-your-approach-to-negative-balance-liability).

## See also

- [Get started with Connect embedded components](https://docs.stripe.com/connect/get-started-connect-embedded-components.md)
- [Customize embedded components](https://docs.stripe.com/connect/customize-connect-embedded-components.md)
