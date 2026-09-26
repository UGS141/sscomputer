import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Search, Download, QrCode, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import type { VerificationResult } from '../services/api';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateBreadcrumbSchema } from '../seo/schemas';
import { trackSEOEvent } from '../seo/analytics';

export const CertificateVerificationPage: React.FC = () => {
  const [certInput, setCertInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await apiService.verifyCertificate(certInput);
      setResult(res);
      trackSEOEvent('certificate_verification', { cert_number: certInput, found: res.valid });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleNumber: string) => {
    setCertInput(sampleNumber);
    setResult(null);
  };

  const schemas = [
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Certificate Verification', url: '/verify-certificate' },
    ]),
  ];

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title="Online Certificate Verification | Sri Shanmukha Computer Institute"
        description="Verify official course completion certificates issued by Sri Shanmukha Computer Institute (SSCI), Nellore."
        canonicalPath="/verify-certificate"
        schemas={schemas}
      />
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="flex justify-center text-teal-200">
            <Breadcrumb items={[{ label: 'Verify Certificate' }]} />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-[#F5B72C] shadow-lg">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Verify Your <span className="text-[#F5B72C]">SSCI Certificate</span>
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 max-w-xl mx-auto leading-relaxed">
            Enter your certificate number below to verify the authenticity of an official Sri Shanmukha Computer Institute credential.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Lookup Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-2">
                Certificate Registration Number <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SSCI-2026-9482"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-mono font-bold uppercase tracking-wider outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Verify Certificate Authenticity
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sample Shortcuts */}
          <div className="pt-4 border-t border-gray-100 text-xs space-y-2">
            <span className="font-bold text-[#123B3A] block">Try Sample Verification IDs:</span>
            <div className="flex flex-wrap gap-2">
              {['SSCI-2026-9482', 'SSCI-2026-1024', 'SSCI-2026-5541', 'SSCI-2026-8812'].map((sample) => (
                <button
                  key={sample}
                  onClick={() => loadSample(sample)}
                  className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-[#087F78] font-mono font-bold text-[11px] transition-colors border border-teal-200"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Result Output */}
        {result && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {result.valid ? (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-400 shadow-2xl relative overflow-hidden space-y-6">
                
                {/* Official Verification Header */}
                <div className="bg-emerald-50 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-6 border-b border-emerald-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                        AUTHENTIC CREDENTIAL VERIFIED
                      </span>
                      <h3 className="text-xl font-extrabold text-[#123B3A]">Official SSCI Certificate</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-mono text-xs font-bold border border-emerald-300">
                    STATUS: VERIFIED
                  </span>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Student Name</span>
                    <strong className="text-lg font-bold text-[#123B3A]">{result.studentName}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Course Enrolled</span>
                    <strong className="text-base font-bold text-[#087F78]">{result.courseName}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Certificate Number</span>
                    <span className="font-mono text-sm font-bold text-gray-800">{result.certificateNumber}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Issue Date</span>
                    <span className="text-sm font-semibold text-gray-700">{result.issueDate}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Performance Grade</span>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                      {result.grade}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Verification Stamp</span>
                    <span className="text-xs font-mono font-semibold text-emerald-700">{result.verificationCode}</span>
                  </div>
                </div>

                {/* Footer Certificate Actions & QR */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <QrCode className="w-10 h-10 text-[#123B3A] shrink-0" />
                    <span>Digitally signed & authenticated in SSCI Academic Registry.</span>
                  </div>

                  <button
                    onClick={() => alert('Official Certificate PDF Download: Generating authenticated PDF copy...')}
                    className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#123B3A] hover:bg-[#087F78] shadow-md flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Certificate Copy
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-xl space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Certificate Not Found</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  {result.errorMessage}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
