const WHATSAPP_NUMBER = "923475175875";

interface WhatsAppOptions {
  productName?: string;
  moq?: number;
  price?: string;
}

export function getWhatsAppUrl(options?: WhatsAppOptions): string {
  let message: string;

  if (options?.productName) {
    message = `Hello, I want to order:\nProduct: ${options.productName}${options.moq ? `\nMOQ: ${options.moq}` : ""}${options.price ? `\nPrice: ${options.price}` : ""}\nPlease share wholesale price.`;
  } else {
    message =
      "Hello, I want wholesale pricing for biscuits & candies.";
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(options?: WhatsAppOptions) {
  window.open(getWhatsAppUrl(options), "_blank", "noopener,noreferrer");
}
