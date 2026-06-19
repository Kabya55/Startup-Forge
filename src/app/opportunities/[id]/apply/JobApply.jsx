"use client";

import { useState } from "react";

import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  Description,
} from "@heroui/react";

import {
  FileText,
  Link,
  LayoutHeaderCells,
  ArrowRight,
} from "@gravity-ui/icons";
import { submitApplication } from "@/lib/actions/applications";
import { toast } from "react-toastify";

const OpportunityApply = ({ opportunity, applicant }) => {
  const [formData, setFormData] = useState({
    resumeLink: "",
    portfolioLink: "",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      opportunityId: opportunity?._id,
      role_title: opportunity?.role_title,
      startup_name: opportunity?.startup_name,
      applicantId: applicant?.id,
      applicantName: applicant?.name,
      applicantEmail: applicant?.email,
      status: "applied",
      ...formData,
    };
    const res = await submitApplication(payload);

    if (res.insertedId) {
      toast.success("Application submitted successfully!");
      setFormData({
        resumeLink: "",
        portfolioLink: "",
        additionalNotes: "",
      });
      window.location.reload();
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Application Form
            </span>

            <h2 className="text-2xl font-bold mt-1">
              Apply for {opportunity?.title || "this position"}
            </h2>

            {applicant?.name && (
              <p className="text-sm text-zinc-500 mt-1">
                Applying as:{" "}
                <span className="font-medium">
                  {applicant.name} ({applicant.email})
                </span>
              </p>
            )}
          </div>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            {/* Resume Link */}
            <TextField isRequired name="resumeLink">
              <Label className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-4 h-4" />
                Resume Link
              </Label>

              <Input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
              />

              <Description>Provide a public link to your resume</Description>
            </TextField>

            {/* Portfolio */}
            <TextField name="portfolioLink">
              <Label className="flex items-center gap-1.5 mb-1.5">
                <Link className="w-4 h-4" />
                Portfolio (Optional)
              </Label>

              <Input
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </TextField>

            {/* Notes */}
            <TextField name="additionalNotes">
              <Label className="flex items-center gap-1.5 mb-1.5">
                <LayoutHeaderCells className="w-4 h-4" />
                Short Message (Optional)
              </Label>

              <textarea
                name="additionalNotes"
                rows={4}
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Anything you'd like to share..."
              />
            </TextField>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                onClick={() =>
                  setFormData({
                    resumeLink: "",
                    portfolioLink: "",
                    additionalNotes: "",
                  })
                }
              >
                Clear
              </Button>

              <Button type="submit">
                Submit <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default OpportunityApply;
