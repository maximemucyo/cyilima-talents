'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';

interface LocationFilterProps {
  onFilterChange: (filters: LocationFilters) => void;
  onClear: () => void;
}

export interface LocationFilters {
  rwandaOnly?: boolean;
  selectedCountries?: string[];
  selectedCities?: string[];
  searchText?: string;
}

const rwandaCities = [
  'Kigali',
  'Gisenyi',
  'Muhanga',
  'Butare',
  'Musanze',
  'Kibuye',
  'Gitarama',
  'Ruhengeri',
];

const countries = [
  { code: 'RW', name: 'Rwanda' },
  { code: 'UG', name: 'Uganda' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'BU', name: 'Burundi' },
  { code: 'DRC', name: 'Democratic Republic of Congo' },
  { code: 'OTHER', name: 'Other' },
];

export function LocationFilter({ onFilterChange, onClear }: LocationFilterProps) {
  const [rwandaOnly, setRwandaOnly] = React.useState(true);
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(['RW']);
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [searchText, setSearchText] = React.useState('');

  const handleRwandaToggle = (checked: boolean) => {
    setRwandaOnly(checked);
    if (checked) {
      setSelectedCountries(['RW']);
      setSelectedCities([]);
    }
    onFilterChange({
      rwandaOnly: checked,
      selectedCountries: checked ? ['RW'] : selectedCountries,
      selectedCities: checked ? [] : selectedCities,
      searchText,
    });
  };

  const handleCountryToggle = (code: string) => {
    let newCountries;
    if (selectedCountries.includes(code)) {
      newCountries = selectedCountries.filter((c) => c !== code);
    } else {
      newCountries = [...selectedCountries, code];
    }
    setSelectedCountries(newCountries);
    onFilterChange({
      rwandaOnly: false,
      selectedCountries: newCountries,
      selectedCities,
      searchText,
    });
  };

  const handleCityToggle = (city: string) => {
    let newCities;
    if (selectedCities.includes(city)) {
      newCities = selectedCities.filter((c) => c !== city);
    } else {
      newCities = [...selectedCities, city];
    }
    setSelectedCities(newCities);
    onFilterChange({
      rwandaOnly,
      selectedCountries,
      selectedCities: newCities,
      searchText,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onFilterChange({
      rwandaOnly,
      selectedCountries,
      selectedCities,
      searchText: value,
    });
  };

  const isFiltered = rwandaOnly || selectedCountries.length > 1 || selectedCities.length > 0 || searchText.length > 0;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            Location Filter
          </CardTitle>
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRwandaOnly(true);
                setSelectedCountries(['RW']);
                setSelectedCities([]);
                setSearchText('');
                onClear();
              }}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rwanda Focus */}
        <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Checkbox
              id="rwandaOnly"
              checked={rwandaOnly}
              onCheckedChange={handleRwandaToggle}
              className="border-border"
            />
            <Label htmlFor="rwandaOnly" className="text-foreground cursor-pointer font-medium">
              Rwanda-Based Candidates Only
            </Label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Show only candidates based in Rwanda for recruitment priority
          </p>
        </div>

        {!rwandaOnly && (
          <>
            {/* Countries */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Countries</p>
              <div className="space-y-2">
                {countries.map((country) => (
                  <div key={country.code} className="flex items-center gap-2">
                    <Checkbox
                      id={`country-${country.code}`}
                      checked={selectedCountries.includes(country.code)}
                      onCheckedChange={() => handleCountryToggle(country.code)}
                      className="border-border"
                    />
                    <Label
                      htmlFor={`country-${country.code}`}
                      className="text-foreground cursor-pointer font-normal text-sm"
                    >
                      {country.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {rwandaOnly && (
          <>
            {/* Rwanda Cities */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Rwanda Cities</p>
              <div className="space-y-2">
                {rwandaCities.map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={() => handleCityToggle(city)}
                      className="border-border"
                    />
                    <Label
                      htmlFor={`city-${city}`}
                      className="text-foreground cursor-pointer font-normal text-sm"
                    >
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Leave empty to show all Rwanda candidates</p>
            </div>
          </>
        )}

        {/* Location Search */}
        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor="locationSearch" className="text-foreground text-sm font-medium">
            Search Location
          </Label>
          <Input
            id="locationSearch"
            placeholder="Search by city name..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-muted border-border text-foreground placeholder-muted-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
}
