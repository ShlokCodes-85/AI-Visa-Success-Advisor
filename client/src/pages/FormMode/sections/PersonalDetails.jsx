import { Calendar } from 'lucide-react';
import FormField from '../../../components/FormField';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe'
];

export default function PersonalDetails({ formData, handleInputChange, errors = {} }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Personal Details</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide your personal details for the student visa application.</p>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Doe"
          error={errors.fullName}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.dateOfBirth}</p>
          )}
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border ${
                errors.dateOfBirth ? "border-red-500" : "border-transparent dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer`}
            />
            <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-black dark:text-gray-300 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
          {errors.gender && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.gender}</p>
          )}
          <select
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
              ${errors.gender
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            `}
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <FormField
          label="Email ID"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          error={errors.contactEmail}
        />

        <FormField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="+91 80970 58099"
          error={errors.phoneNumber}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nationality</label>
          {errors.nationality && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.nationality}</p>
          )}
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
              ${errors.nationality
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            `}
          >
            <option value="">Select your nationality</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country of Residency</label>
          {errors.countryOfResidency && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.countryOfResidency}</p>
          )}
          <select
            name="countryOfResidency"
            value={formData.countryOfResidency || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
              ${errors.countryOfResidency
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            `}
          >
            <option value="">Select country of residency</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
