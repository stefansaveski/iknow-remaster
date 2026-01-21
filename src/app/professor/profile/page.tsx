"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faAddressCard,
  faCalendarAlt,
  faFlag,
  faVenus,
  faMars,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPassport,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type PersonalInfo = {
  firstName: string;
  middleName: string;
  lastName: string;
  maidenName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  citizenship: string;
  scholarship: string;
  currentPlan: string;
  registryNumber: string;
  studyGroup: string;
  notes?: string;
  index: string;
  embg: string;
};

type BirthInfo = {
  placeOfBirth: string;
  municipalityOfBirth: string;
  country: string;
};

// Present in the API response, but intentionally not shown on professor profile.
type PreviousEducation = {
  type: string;
  profession: string;
  average: string | number;
  language: string;
  country: string;
  previousUniversity: string;
  previousFaculty: string;
  previousStudyMode: string;
};

// Present in the API response, but intentionally not shown on professor profile.
type EnrollmentInfo = {
  enrollmentYear: string | number;
  status: string;
  cycle: string;
  program: string;
  quota: string;
  secondaryEducationNumber: string;
  previousEducationCredits: string | number;
};

type Contact = {
  placeOfResidence: string;
  municipalityOfResidence: string;
  country: string;
  address: string;
  temporaryAddress: string;
  phone: string;
  mobilePhone: string;
  passportNumber: string;
  passportExpiryDate: string;
  email: string;
  microsoftEmail: string;
};

type StudentProfile = {
  personalInfo: PersonalInfo;
  birthInfo: BirthInfo;
  previousEducation: PreviousEducation;
  enrollmentInfo: EnrollmentInfo;
  contact: Contact;
};

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: IconDefinition;
}

const InfoRow = ({ label, value, icon }: InfoRowProps) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2 text-gray-600 font-medium">
      {icon && <FontAwesomeIcon icon={icon} className="w-4 h-4" />}
      <span>{label}:</span>
    </div>
    <div className="text-gray-900 font-semibold text-right max-w-xs break-words">
      {value || "N/A"}
    </div>
  </div>
);

interface SectionProps {
  title: string;
  icon: IconDefinition;
  children: React.ReactNode;
}

const Section = ({ title, icon, children }: SectionProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="bg-primary text-white px-6 py-4">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={icon} className="text-xl" />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function ProfessorProfilePage() {
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAccessToken();
      if (!token) {
        setErrorMessage("Not authenticated. Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://iknow-api.onrender.com/api/user/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(text || `Failed to load profile (${response.status})`);
        }

        const data = (await response.json()) as StudentProfile;
        if (!cancelled) setProfileData(data);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to load profile.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Loading...</div>
      </div>
    );
  }

  if (errorMessage || !profileData) {
    return (
      <div className="min-h-screen pb-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage ?? "Failed to load profile."}
        </div>
      </div>
    );
  }

  const { personalInfo, birthInfo, contact } = profileData;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
              <FontAwesomeIcon icon={faUser} className="text-3xl text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.middleName} {personalInfo.lastName}
            </h1>
            <div className="text-lg opacity-90">
              Индекс: {personalInfo.index} | ЕМБГ: {personalInfo.embg}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Лични податоци" icon={faIdCard}>
          <InfoRow label="Име" value={personalInfo.firstName} />
          <InfoRow label="Средно име" value={personalInfo.middleName} />
          <InfoRow label="Презиме" value={personalInfo.lastName} />
          <InfoRow label="Моминско презиме" value={personalInfo.maidenName} />
          <InfoRow label="Датум на раѓање" value={personalInfo.dateOfBirth} icon={faCalendarAlt} />
          <InfoRow
            label="Пол"
            value={personalInfo.gender}
            icon={personalInfo.gender === "машки" ? faMars : faVenus}
          />
          <InfoRow label="Националност" value={personalInfo.nationality} icon={faFlag} />
          <InfoRow label="Државјанство" value={personalInfo.citizenship} />
          <InfoRow label="Стипендија" value={personalInfo.scholarship} />
          <InfoRow label="Тековен план" value={personalInfo.currentPlan} />
          <InfoRow label="Бр. во матична книга" value={personalInfo.registryNumber} />
          <InfoRow label="Група на студирање" value={personalInfo.studyGroup} />
          {personalInfo.notes && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">Забелешка:</div>
              <div className="text-sm text-blue-700">{personalInfo.notes}</div>
            </div>
          )}
        </Section>

        {/* Birth Information */}
        <Section title="Податоци за раѓање" icon={faMapMarkerAlt}>
          <InfoRow label="Место на раѓање" value={birthInfo.placeOfBirth} />
          <InfoRow label="Општина на раѓање" value={birthInfo.municipalityOfBirth} />
          <InfoRow label="Земја" value={birthInfo.country} />
        </Section>

        {/* Contact Information */}
        <div className="lg:col-span-2">
          <Section title="Контакт" icon={faAddressCard}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InfoRow label="Место на живеење" value={contact.placeOfResidence} icon={faMapMarkerAlt} />
                <InfoRow label="Општина на живеење" value={contact.municipalityOfResidence} />
                <InfoRow label="Држава" value={contact.country} />
                <InfoRow label="Адреса" value={contact.address} />
                <InfoRow label="Адреса на престој" value={contact.temporaryAddress} />
              </div>
              <div>
                <InfoRow label="Телефон" value={contact.phone} icon={faPhone} />
                <InfoRow label="Моб. телефон" value={contact.mobilePhone} icon={faPhone} />
                <InfoRow label="Број на пасош" value={contact.passportNumber} icon={faPassport} />
                <InfoRow label="Датум на истекување на пасошот" value={contact.passportExpiryDate} />
                <InfoRow label="Е-пошта" value={contact.email} icon={faEnvelope} />
                <InfoRow label="Microsoft email" value={contact.microsoftEmail} icon={faEnvelope} />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
