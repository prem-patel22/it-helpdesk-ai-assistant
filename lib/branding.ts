// lib/branding.ts
// Client branding configuration - Change these per client

export interface BrandingConfig {
  companyName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  supportEmail: string;
  supportPhone: string;
}

// Default branding (for your demo)
export const defaultBranding: BrandingConfig = {
  companyName: "IT Helpdesk AI",
  logo: "🤖",
  primaryColor: "from-blue-600 to-purple-600",
  secondaryColor: "from-purple-600 to-pink-600",
  accentColor: "blue",
  welcomeMessage: "Hello! I'm your IT Helpdesk Assistant.",
  supportEmail: "helpdesk@company.com",
  supportPhone: "+1-800-555-1234",
};

// Client-specific branding (add as you get clients)
export const clientBranding: Record<string, BrandingConfig> = {
  // Example client 1
  "acme-corp": {
    companyName: "Acme Corp IT Support",
    logo: "🏢",
    primaryColor: "from-red-600 to-orange-600",
    secondaryColor: "from-orange-600 to-yellow-600",
    accentColor: "red",
    welcomeMessage: "Welcome to Acme Corp IT Support!",
    supportEmail: "it@acmecorp.com",
    supportPhone: "+1-555-123-4567",
  },
  // Example client 2
  "tech-solutions": {
    companyName: "Tech Solutions Helpdesk",
    logo: "💻",
    primaryColor: "from-green-600 to-teal-600",
    secondaryColor: "from-teal-600 to-cyan-600",
    accentColor: "green",
    welcomeMessage: "Tech Solutions IT Support at your service!",
    supportEmail: "support@techsolutions.com",
    supportPhone: "+1-555-987-6543",
  },
};

// Get branding by client ID (default to demo)
export function getBranding(clientId?: string): BrandingConfig {
  if (clientId && clientBranding[clientId]) {
    return clientBranding[clientId];
  }
  return defaultBranding;
}