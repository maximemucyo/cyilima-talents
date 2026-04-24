'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CSVColumnMapperProps {
  csvHeaders: string[];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

export function CSVColumnMapper({ csvHeaders, onMappingComplete, onCancel }: CSVColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    yearsExperience: '',
    currentRole: '',
    currentCompany: '',
    linkedinUrl: '',
    githubUrl: '',
    cvUrl: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const requiredFields = ['firstName', 'lastName', 'email'];

  const handleMappingChange = (field: string, header: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: header,
    }));
  };

  const validateMapping = () => {
    const newErrors: string[] = [];
    requiredFields.forEach((field) => {
      if (!mapping[field]) {
        newErrors.push(`${field} is required`);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateMapping()) {
      onMappingComplete(mapping);
    }
  };

  const usedHeaders = Object.values(mapping).filter((v) => v);
  const availableHeaders = csvHeaders.filter((h) => !usedHeaders.includes(h) || mapping[Object.keys(mapping).find((k) => mapping[k] === h)!]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Map CSV Columns</CardTitle>
        <CardDescription className="text-muted-foreground">
          Select which CSV column corresponds to each candidate field
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errors.length > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Missing required fields:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Required Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-destructive">*</span> Required Fields
          </h3>
          {requiredFields.map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="text-foreground capitalize mb-2 block">
                {field === 'firstName' ? 'First Name' : field === 'lastName' ? 'Last Name' : field}
              </Label>
              <Select value={mapping[field]} onValueChange={(value) => handleMappingChange(field, value)}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue placeholder={`Select ${field} column`} />
                </SelectTrigger>
                <SelectContent className="bg-muted border-border">
                  <SelectItem value="">— Not mapped —</SelectItem>
                  {csvHeaders.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Optional Fields</h3>
          {Object.keys(mapping)
            .filter((k) => !requiredFields.includes(k))
            .map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="text-foreground capitalize mb-2 block">
                  {field === 'yearsExperience'
                    ? 'Years Experience'
                    : field === 'currentRole'
                    ? 'Current Role'
                    : field === 'currentCompany'
                    ? 'Current Company'
                    : field === 'linkedinUrl'
                    ? 'LinkedIn URL'
                    : field === 'githubUrl'
                    ? 'GitHub URL'
                    : field === 'cvUrl'
                    ? 'CV URL'
                    : field}
                </Label>
                <Select value={mapping[field]} onValueChange={(value) => handleMappingChange(field, value)}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder={`Select ${field} column`} />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="">— Not mapped —</SelectItem>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
        </div>

        {/* Info Box */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex gap-2 items-start">
            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-accent">
              <p className="font-medium mb-1">CSV Headers Found:</p>
              <p className="text-xs opacity-90">{csvHeaders.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue with Mapping
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
