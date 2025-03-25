/**
 * File: apps/www/app/(app)/tabs/careers/components/careers-form.tsx
 * Description: Application form component for job applications
 * Features:
 * - Pre-fills role based on selection
 * - Collects applicant information
 * - Handles form submission
 */

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Props interface for the careers form
interface CareersFormProps {
  prefillRole?: string; // Optional role to pre-fill in the form
}

export function CareersForm({ prefillRole = "" }: CareersFormProps) {
  // State management for form data and loading state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: prefillRole,
    loomVideo: "",
  });

  // Update role field when prefillRole changes
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, role: prefillRole }));
  }, [prefillRole]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API request
    setTimeout(() => {
      alert("Application submitted! 🚀");
      setLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md space-y-4">
      {/* Name Input */}
      <Input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {/* Email Input */}
      <Input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {/* Role Input */}
      <Input
        type="text"
        name="role"
        placeholder="Preferred Role (e.g., Blockchain Dev, AI Engineer)"
        value={formData.role}
        onChange={handleChange}
        required
      />
      {/* Loom Video Link Input */}
      <Textarea
        name="loomVideo"
        placeholder="Loom Video Link (2 min intro)"
        value={formData.loomVideo}
        onChange={handleChange}
        required
      />
      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Apply Now 🚀"}
      </Button>
    </form>
  );
}
