"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    console.log("Contact form:", data);
    toast("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />
      <section className="py-8 lg:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-text mb-2">
                Get in Touch
              </h1>
              <p className="text-gray-500 mb-8">
                Have a question or want to become a wholesale partner? We&apos;d
                love to hear from you.
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-candy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-text text-sm">
                      Address
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Nankari Bazar, Rawalpindi, Pakistan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-candy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-text text-sm">
                      Phone
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      +92 347 5175875
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-candy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark-text text-sm">
                      Email
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      info@arslanwholesale.com
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/923475175875"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-2xl font-medium text-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Chat on WhatsApp</p>
                  <p className="text-xs text-white/80">
                    Quick response during business hours
                  </p>
                </div>
              </a>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-dark-text mb-1.5 block">
                      Full Name *
                    </label>
                    <input
                      {...register("name")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-text mb-1.5 block">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-dark-text mb-1.5 block">
                      Company
                    </label>
                    <input
                      {...register("company")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-text mb-1.5 block">
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Subject *
                  </label>
                  <input
                    {...register("subject")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Message *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-candy text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
