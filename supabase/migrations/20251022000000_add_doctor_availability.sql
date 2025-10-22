-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(doctor_id, day_of_week, start_time)
);

-- Create indexes for better query performance
CREATE INDEX idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_day ON doctor_availability(day_of_week);
CREATE INDEX idx_doctor_availability_time ON doctor_availability(start_time, end_time);

-- Enable Row Level Security
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

-- Policies for doctor_availability
-- Doctors can view and manage their own availability
CREATE POLICY "Doctors can view their own availability"
  ON doctor_availability FOR SELECT
  USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert their own availability"
  ON doctor_availability FOR INSERT
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their own availability"
  ON doctor_availability FOR UPDATE
  USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can delete their own availability"
  ON doctor_availability FOR DELETE
  USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE profile_id = auth.uid()
    )
  );

-- Patients can view doctor availability
CREATE POLICY "Patients can view doctor availability"
  ON doctor_availability FOR SELECT
  USING (is_available = true);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_doctor_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_doctor_availability_timestamp
  BEFORE UPDATE ON doctor_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_availability_updated_at();

-- Insert sample availability data for existing doctors
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_available)
SELECT 
  d.id,
  day_of_week,
  '09:00:00'::TIME,
  '17:00:00'::TIME,
  true
FROM doctors d
CROSS JOIN generate_series(1, 5) as day_of_week -- Monday to Friday
WHERE NOT EXISTS (
  SELECT 1 FROM doctor_availability da WHERE da.doctor_id = d.id
)
LIMIT 100;

COMMENT ON TABLE doctor_availability IS 'Stores doctor availability schedules by day and time';
COMMENT ON COLUMN doctor_availability.day_of_week IS '0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday';
