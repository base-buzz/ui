"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CareersFormProps {
  prefillRole?: string;
}

export function CareersForm({ prefillRole = "" }: CareersFormProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      <Input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        type="text"
        name="role"
        placeholder="Preferred Role (e.g., Blockchain Dev, AI Engineer)"
        value={formData.role}
        onChange={handleChange}
        required
      />
      <Textarea
        name="loomVideo"
        placeholder="Loom Video Link (2 min intro)"
        value={formData.loomVideo}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Apply Now 🚀"}
      </Button>
    </form>
  );
}
