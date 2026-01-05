import type { Metadata } from "next";
import { Column, Container, Heading, Text } from "@buttergolf/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | ButterGolf",
  description:
    "How ButterGolf collects, uses, and protects your personal information",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <Column
      backgroundColor="$background"
      minHeight="100vh"
      alignItems="center"
      width="100%"
    >
      <Container size="lg" paddingVertical="$10">
        <Column gap="$2xl">
          {/* Header */}
          <Column gap="$md" alignItems="center">
            <Heading level={1}>Privacy Policy</Heading>
            <Text color="$textSecondary" textAlign="center">
              Last updated: January 5, 2026
            </Text>
          </Column>

          {/* Content */}
          <Column gap="$xl">
            <Column gap="$md">
              <Text size="$6">
                At ButterGolf, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and protect your
                personal information when you use our marketplace platform.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>1. Information We Collect</Heading>
              <Column gap="$sm">
                <Text fontWeight="600">1.1 Information You Provide</Text>
                <Text>
                  When you create an account, list items, or make purchases, we
                  collect information including:
                </Text>
                <Column gap="$xs" paddingLeft="$lg">
                  <Text>• Name and contact details (email, phone number)</Text>
                  <Text>• Billing and shipping addresses</Text>
                  <Text>• Payment information (processed securely by our payment provider)</Text>
                  <Text>• Profile information and preferences</Text>
                  <Text>• Product listings and descriptions</Text>
                  <Text>• Messages and communications with other users</Text>
                </Column>
              </Column>
              <Column gap="$sm">
                <Text fontWeight="600">1.2 Automatically Collected Information</Text>
                <Text>
                  We automatically collect certain information when you use ButterGolf:
                </Text>
                <Column gap="$xs" paddingLeft="$lg">
                  <Text>• Device information (IP address, browser type, operating system)</Text>
                  <Text>• Usage data (pages viewed, links clicked, time spent)</Text>
                  <Text>• Cookies and similar tracking technologies</Text>
                  <Text>• Location data (with your consent)</Text>
                </Column>
              </Column>
            </Column>

            <Column gap="$md">
              <Heading level={2}>2. How We Use Your Information</Heading>
              <Text>We use the information we collect to:</Text>
              <Column gap="$xs" paddingLeft="$lg">
                <Text>• Provide and improve our marketplace services</Text>
                <Text>• Process transactions and send confirmations</Text>
                <Text>• Communicate with you about your account and orders</Text>
                <Text>• Personalise your experience and show relevant listings</Text>
                <Text>• Detect and prevent fraud and security threats</Text>
                <Text>• Comply with legal obligations</Text>
                <Text>• Send promotional emails (with your consent)</Text>
                <Text>• Analyse platform usage to improve our services</Text>
              </Column>
            </Column>

            <Column gap="$md">
              <Heading level={2}>3. How We Share Your Information</Heading>
              <Text>We may share your information with:</Text>
              <Column gap="$sm">
                <Text fontWeight="600">3.1 Other Users</Text>
                <Text>
                  When you list items or make purchases, certain information
                  (name, location, public profile) is visible to facilitate
                  transactions.
                </Text>
              </Column>
              <Column gap="$sm">
                <Text fontWeight="600">3.2 Service Providers</Text>
                <Text>
                  We work with third-party companies that help us operate our
                  platform, including payment processors, shipping services,
                  hosting providers, and analytics tools. These providers only
                  access information necessary to perform their services.
                </Text>
              </Column>
              <Column gap="$sm">
                <Text fontWeight="600">3.3 Legal Requirements</Text>
                <Text>
                  We may disclose your information when required by law, to
                  protect our rights, or to respond to legal requests from
                  authorities.
                </Text>
              </Column>
              <Column gap="$sm">
                <Text fontWeight="600">3.4 Business Transfers</Text>
                <Text>
                  If ButterGolf is involved in a merger, acquisition, or sale of
                  assets, your information may be transferred as part of that
                  transaction.
                </Text>
              </Column>
            </Column>

            <Column gap="$md">
              <Heading level={2}>4. Cookies and Tracking Technologies</Heading>
              <Text>
                We use cookies and similar technologies to enhance your
                experience, analyse usage patterns, and deliver personalised
                content. You can control cookie preferences through your browser
                settings, but disabling cookies may limit some platform features.
              </Text>
              <Column gap="$xs" paddingLeft="$lg">
                <Text>• Essential cookies: Required for platform functionality</Text>
                <Text>• Analytics cookies: Help us understand how you use the site</Text>
                <Text>• Advertising cookies: Deliver relevant ads and promotions</Text>
              </Column>
            </Column>

            <Column gap="$md">
              <Heading level={2}>5. Data Security</Heading>
              <Text>
                We implement industry-standard security measures to protect your
                information from unauthorised access, disclosure, or destruction.
                This includes encryption, secure servers, and regular security
                audits. However, no method of transmission over the internet is
                100% secure, and we cannot guarantee absolute security.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>6. Your Privacy Rights</Heading>
              <Text>
                Depending on your location, you may have certain rights regarding
                your personal information:
              </Text>
              <Column gap="$xs" paddingLeft="$lg">
                <Text>• Access: Request a copy of your personal data</Text>
                <Text>• Correction: Update inaccurate or incomplete information</Text>
                <Text>• Deletion: Request deletion of your account and data</Text>
                <Text>• Portability: Receive your data in a transferable format</Text>
                <Text>• Opt-out: Unsubscribe from marketing communications</Text>
                <Text>• Objection: Object to certain processing activities</Text>
              </Column>
              <Text>
                To exercise these rights, please contact us at privacy@buttergolf.com
                or through our live chat support.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>7. Data Retention</Heading>
              <Text>
                We retain your personal information for as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and enforce our agreements. When you delete your
                account, we will delete or anonymise your information within 30
                days, except where required by law to retain it longer.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>8. Children's Privacy</Heading>
              <Text>
                ButterGolf is not intended for users under 18 years of age. We
                do not knowingly collect personal information from children. If
                we become aware that a child has provided us with personal
                information, we will take steps to delete such information.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>9. International Data Transfers</Heading>
              <Text>
                Your information may be transferred to and processed in countries
                outside your own. We ensure appropriate safeguards are in place
                to protect your information in accordance with this Privacy
                Policy and applicable data protection laws.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>10. Third-Party Links</Heading>
              <Text>
                Our platform may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these external sites. We encourage you to review their privacy
                policies before providing any personal information.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>11. Updates to This Policy</Heading>
              <Text>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of material changes by email or through a prominent notice on
                our platform. Your continued use of ButterGolf after such changes
                constitutes acceptance of the updated policy.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>12. Contact Us</Heading>
              <Text>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal information, please contact us:
              </Text>
              <Column gap="$xs" paddingLeft="$lg">
                <Text>Email: privacy@buttergolf.com</Text>
                <Text>Live Chat: Available 9am-6pm GMT Monday-Friday</Text>
                <Text>Postal Address: [To be determined]</Text>
              </Column>
            </Column>

            <Column gap="$md">
              <Heading level={2}>13. GDPR Compliance (EU Users)</Heading>
              <Text>
                If you are located in the European Union, you have additional
                rights under the General Data Protection Regulation (GDPR):
              </Text>
              <Column gap="$xs" paddingLeft="$lg">
                <Text>• Right to be informed about data processing</Text>
                <Text>• Right to access your personal data</Text>
                <Text>• Right to rectification of inaccurate data</Text>
                <Text>• Right to erasure ("right to be forgotten")</Text>
                <Text>• Right to restrict processing</Text>
                <Text>• Right to data portability</Text>
                <Text>• Right to object to processing</Text>
                <Text>• Rights related to automated decision-making</Text>
              </Column>
              <Text>
                Our legal basis for processing your information includes your
                consent, performance of a contract, legal obligations, and
                legitimate interests in operating our platform.
              </Text>
            </Column>

            <Column gap="$md">
              <Heading level={2}>14. California Privacy Rights (CCPA)</Heading>
              <Text>
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA), including the
                right to know what personal information is collected, the right
                to delete personal information, and the right to opt-out of the
                sale of personal information. ButterGolf does not sell your
                personal information.
              </Text>
            </Column>
          </Column>
        </Column>
      </Container>
    </Column>
  );
}
