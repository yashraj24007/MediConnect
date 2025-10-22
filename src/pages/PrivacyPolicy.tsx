import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: October 22, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              At MediConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Name, email address, phone number</li>
                <li>Date of birth and address</li>
                <li>Medical history and health records</li>
                <li>Appointment details and consultation notes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Data</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Browser type and version</li>
                <li>IP address and device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Search queries and interaction data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Information</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Payment transaction details (processed securely via Razorpay)</li>
                <li>We do not store complete credit card information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To facilitate appointment booking and healthcare services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To enable communication between patients and healthcare providers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To process payments and maintain financial records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To improve our AI features and personalize your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To send appointment reminders and important notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To comply with legal obligations and prevent fraud</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We implement industry-standard security measures to protect your personal and medical information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure SSL/TLS connections for all transmissions</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage with Supabase infrastructure</li>
            </ul>
            <p className="mt-4">
              Despite our efforts, no security system is impenetrable. We cannot guarantee absolute security of your information.
            </p>
          </CardContent>
        </Card>

        {/* Sharing Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sharing Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Healthcare Providers:</strong> Doctors you book appointments with</li>
              <li><strong>Service Providers:</strong> Payment processors, cloud storage, analytics</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
            </ul>
            <p className="mt-4">
              We <strong>never</strong> sell your personal or medical information to third parties for marketing purposes.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Access:</strong> Request copies of your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Correction:</strong> Update inaccurate or incomplete information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Portability:</strong> Receive your data in a structured format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span><strong>Opt-out:</strong> Unsubscribe from marketing communications</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Essential cookies for site functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
            <p className="mt-3">
              You can control cookie preferences through your browser settings.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Our services are not intended for children under 18 without parental consent. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes via email or prominent notice on our platform. Your continued use after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:privacy@mediconnect.com" className="text-primary hover:underline">privacy@mediconnect.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+911234567890" className="text-primary hover:underline">+91 123 456 7890</a></p>
              <p><strong>Address:</strong> Hyderabad, Telangana, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
