import type { Metadata } from "next";
import { Column, Container, Heading, Text, Row } from "@buttergolf/ui";
import { Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Centre | ButterGolf",
  description:
    "Get help and answers to common questions about using the ButterGolf marketplace",
  robots: {
    index: true,
    follow: true,
  },
};

export default function HelpCentrePage() {
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
            <Heading level={1}>Help Centre</Heading>
            <Text color="$textSecondary" textAlign="center" size="$6">
              Find answers to common questions or get in touch with our support
              team
            </Text>
          </Column>

          {/* Contact Options */}
          <Column gap="$lg">
            <Heading level={2}>Get Support</Heading>
            <Row gap="$md" flexWrap="wrap">
              <Column
                backgroundColor="$surface"
                borderRadius="$lg"
                padding="$lg"
                gap="$md"
                alignItems="center"
                flex={1}
                minWidth={250}
                borderWidth={1}
                borderColor="$border"
              >
                <MessageCircle size={32} color="#F45314" />
                <Column gap="$sm" alignItems="center">
                  <Heading level={3}>Live Chat</Heading>
                  <Text color="$textSecondary" textAlign="center">
                    Chat with our support team in real-time
                  </Text>
                  <Text color="$primary" fontWeight="600">
                    Available 9am-6pm GMT Mon-Fri
                  </Text>
                </Column>
              </Column>

              <Column
                backgroundColor="$surface"
                borderRadius="$lg"
                padding="$lg"
                gap="$md"
                alignItems="center"
                flex={1}
                minWidth={250}
                borderWidth={1}
                borderColor="$border"
              >
                <Mail size={32} color="#F45314" />
                <Column gap="$sm" alignItems="center">
                  <Heading level={3}>Email Support</Heading>
                  <Text color="$textSecondary" textAlign="center">
                    Send us an email and we'll respond within 24 hours
                  </Text>
                  <Text color="$primary" fontWeight="600">
                    support@buttergolf.com
                  </Text>
                </Column>
              </Column>

              <Column
                backgroundColor="$surface"
                borderRadius="$lg"
                padding="$lg"
                gap="$md"
                alignItems="center"
                flex={1}
                minWidth={250}
                borderWidth={1}
                borderColor="$border"
              >
                <Clock size={32} color="#F45314" />
                <Column gap="$sm" alignItems="center">
                  <Heading level={3}>Response Times</Heading>
                  <Text color="$textSecondary" textAlign="center">
                    Live chat: Instant
                  </Text>
                  <Text color="$textSecondary" textAlign="center">
                    Email: Within 24 hours
                  </Text>
                </Column>
              </Column>
            </Row>
          </Column>

          {/* FAQ Section */}
          <Column gap="$lg">
            <Heading level={2}>Frequently Asked Questions</Heading>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>How do I list an item for sale?</Heading>
              </Row>
              <Text>
                Click "Sell Now" in the header, then fill out the listing form
                with your item details, upload photos, and set your price. Once
                submitted, your listing will appear in the marketplace. Make
                sure to provide accurate descriptions and clear photos to
                attract buyers.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>What payment methods do you accept?</Heading>
              </Row>
              <Text>
                We accept all major credit and debit cards (Visa, Mastercard,
                American Express), as well as digital wallets like Apple Pay
                and Google Pay. All payments are processed securely through our
                payment provider, Stripe.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>How does shipping work?</Heading>
              </Row>
              <Text>
                Sellers are responsible for shipping items to buyers. We
                recommend using tracked shipping services and communicating
                tracking information through our messaging system. Shipping
                costs are agreed upon between buyer and seller before purchase.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>What is your return policy?</Heading>
              </Row>
              <Text>
                Returns are handled between buyers and sellers. If an item is
                significantly not as described, contact the seller first to
                resolve the issue. If you can't reach an agreement, contact our
                support team through live chat or email, and we'll help mediate
                the situation.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>
                  How do I contact a seller or buyer?
                </Heading>
              </Row>
              <Text>
                Use our secure messaging system to communicate with other users.
                Click the "Message Seller" button on any listing, or access
                your messages from the Messages page in your account. All
                communications should happen through our platform for your
                safety.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>What fees does ButterGolf charge?</Heading>
              </Row>
              <Text>
                ButterGolf charges a small service fee on completed sales to
                maintain and improve the platform. The fee structure is
                displayed during the listing process. There are no fees for
                buyers - you only pay the listed price plus any agreed shipping
                costs.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>How do I become a verified seller?</Heading>
              </Row>
              <Text>
                Complete your profile with accurate information, verify your
                email address, and complete your first successful sale. After
                maintaining positive feedback and following our seller
                guidelines, you may be eligible for verified seller status.
                Contact support for more information.
              </Text>
            </Column>

            <Column
              backgroundColor="$surface"
              borderRadius="$lg"
              padding="$lg"
              gap="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <Row gap="$sm" alignItems="center">
                <HelpCircle size={24} color="#F45314" />
                <Heading level={3}>
                  What should I do if I suspect fraud?
                </Heading>
              </Row>
              <Text>
                If you encounter suspicious activity, unusual payment requests,
                or believe you've been scammed, immediately contact our support
                team through live chat or email at fraud@buttergolf.com. Do not
                complete any transactions if you have concerns, and report the
                user through their profile page.
              </Text>
            </Column>
          </Column>

          {/* Still Need Help */}
          <Column
            backgroundColor="$surface"
            borderRadius="$lg"
            padding="$xl"
            gap="$md"
            alignItems="center"
            borderWidth={2}
            borderColor="$primary"
          >
            <Heading level={2}>Still need help?</Heading>
            <Text color="$textSecondary" textAlign="center">
              Can't find what you're looking for? Our support team is here to
              help!
            </Text>
            <Row gap="$md">
              <Text color="$primary" fontWeight="600">
                Use our live chat (bottom right) or email support@buttergolf.com
              </Text>
            </Row>
          </Column>
        </Column>
      </Container>
    </Column>
  );
}
