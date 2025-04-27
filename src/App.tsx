import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// PDF Tool Routes
import PDFTools from "./pages/pdf";
import MergePDF from "./pages/pdf/MergePDF";
import SplitPDF from "./pages/pdf/SplitPDF";
import CompressPDF from "./pages/pdf/CompressPDF";

// Image Tool Routes
import ImageTools from "./pages/image";
import ResizeImage from "./pages/image/ResizeImage";
import CropImage from "./pages/image/CropImage";
import CompressImage from "./pages/image/CompressImage";
import BackgroundRemove from "./pages/image/BackgroundRemove";

// Calculator Tool Routes
import CalculatorTools from "./pages/calculator";
import BMICalculator from "./pages/calculator/bmi";
import LoanCalculator from "./pages/calculator/loan";
import AgeCalculator from "./pages/calculator/age";
import PercentageCalculator from "./pages/calculator/percentage";

// Text Tool Routes
import TextTools from "./pages/text";
import CaseConverter from "./pages/text/case-converter";
import WordCounter from "./pages/text/word-counter";

// Other Tool Routes
import OtherTools from "./pages/other";
import ColorPicker from "./pages/other/color-picker";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* PDF Tools */}
              <Route path="/pdf" element={<PDFTools />} />
              <Route path="/pdf/merge" element={<MergePDF />} />
              <Route path="/pdf/split" element={<SplitPDF />} />
              <Route path="/pdf/compress" element={<CompressPDF />} />
              
              {/* Image Tools */}
              <Route path="/image" element={<ImageTools />} />
              <Route path="/image/resize" element={<ResizeImage />} />
              <Route path="/image/crop" element={<CropImage />} />
              <Route path="/image/compress-image" element={<CompressImage />} />
              <Route path="/image/background-remove" element={<BackgroundRemove />} />
              
              {/* Calculator Tools */}
              <Route path="/calculator" element={<CalculatorTools />} />
              <Route path="/calculator/bmi" element={<BMICalculator />} />
              <Route path="/calculator/loan" element={<LoanCalculator />} />
              <Route path="/calculator/age" element={<AgeCalculator />} />
              <Route path="/calculator/percentage" element={<PercentageCalculator />} />
              
              {/* Text Tools */}
              <Route path="/text" element={<TextTools />} />
              <Route path="/text/case-converter" element={<CaseConverter />} />
              <Route path="/text/word-counter" element={<WordCounter />} />
              
              {/* Other Tools */}
              <Route path="/other" element={<OtherTools />} />
              <Route path="/other/color-picker" element={<ColorPicker />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
