
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Terms of Service</h1>
          <Separator className="mb-6" />
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using InstantUtils ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>
                InstantUtils provides a suite of online tools for processing files, transforming images, calculating values, and manipulating text ("the Service"). The Service is provided as-is with no guarantees regarding uptime, availability, or continued access.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Conduct</h2>
              <p>
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-8 mt-2 space-y-1">
                <li>Upload, download, or share content that infringes on any patent, trademark, trade secret, copyright, or other proprietary right</li>
                <li>Upload or share any content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
                <li>Attempt to gain unauthorized access to the Service or computer systems or networks connected to the Service</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Privacy</h2>
              <p>
                Our privacy practices are outlined in our Privacy Policy, which is incorporated into these Terms of Service. By using the Service, you consent to our collection and use of information as set forth in the Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of InstantUtils and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "as is" and "as available" basis. InstantUtils makes no warranties, expressed or implied, and hereby disclaims all such warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
              <p>
                In no event shall InstantUtils be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if InstantUtils has been notified of the possibility of such damages.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
              <p>
                InstantUtils reserves the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@instantutils.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
