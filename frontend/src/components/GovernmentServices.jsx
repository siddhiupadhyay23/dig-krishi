import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './GovernmentServices.scss';

const GovernmentServices = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schemes');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    schemeName: '',
    farmerName: '',
    phoneNumber: '',
    aadharNumber: '',
    farmSize: '',
    cropType: '',
    bankAccount: '',
    address: ''
  });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const schemes = [
    {
      id: 'pmkisan',
      title: 'PM-KISAN Scheme',
      category: 'Financial Support',
      description: 'Direct income support to farmers with landholding up to 2 hectares',
      benefits: '₹6,000 per year in 3 equal installments',
      eligibility: [
        'Small and marginal farmers with cultivable land up to 2 hectares',
        'Should have valid land documents',
        'Aadhar card is mandatory',
        'Must have active bank account'
      ],
      documents: [
        'Land ownership certificate/Khatiyan',
        'Aadhar card',
        'Bank passbook',
        'Passport size photograph'
      ],
      applicationProcess: [
        'Visit PM-KISAN portal or CSC center',
        'Fill application form with required details',
        'Upload necessary documents',
        'Verify mobile number with OTP',
        'Submit application and note reference number'
      ],
      deadline: 'Ongoing - No deadline',
      contactInfo: {
        helpline: '155261',
        email: 'pmkisan-ict@gov.in',
        website: 'pmkisan.gov.in'
      },
      status: 'Active'
    },
    {
      id: 'fasal-bima',
      title: 'Pradhan Mantri Fasal Bima Yojana',
      category: 'Insurance',
      description: 'Crop insurance scheme to protect farmers against crop loss',
      benefits: 'Up to sum insured amount for crop losses',
      eligibility: [
        'All farmers including sharecroppers and tenant farmers',
        'Must have insurable interest in the crop',
        'Crop should be notified by the state government',
        'Should pay nominal premium'
      ],
      documents: [
        'Land records/Tenancy documents',
        'Aadhar card',
        'Bank account details',
        'Crop details and area coverage'
      ],
      applicationProcess: [
        'Apply through bank, CSC, or insurance company',
        'Select crop and coverage amount',
        'Pay nominal premium (2% for Kharif, 1.5% for Rabi)',
        'Get policy certificate',
        'Report crop loss within 72 hours if any'
      ],
      deadline: 'Before sowing season (Kharif: July, Rabi: December)',
      contactInfo: {
        helpline: '14447',
        email: 'support@pmfby.gov.in',
        website: 'pmfby.gov.in'
      },
      status: 'Active'
    },
    {
      id: 'kcc',
      title: 'Kisan Credit Card',
      category: 'Credit',
      description: 'Credit facility for farmers to meet agricultural expenses',
      benefits: 'Up to ₹3 lakhs at 4% interest rate with interest subvention',
      eligibility: [
        'All farmers including tenant farmers',
        'Should have valid KYC documents',
        'Land ownership or tenancy rights',
        'Good credit history preferred'
      ],
      documents: [
        'Application form with photograph',
        'Identity and address proof',
        'Land documents/Tenancy certificate',
        'Income certificate'
      ],
      applicationProcess: [
        'Apply at any bank branch',
        'Fill KCC application form',
        'Submit required documents',
        'Bank will verify documents and land',
        'KCC will be issued within 14 days'
      ],
      deadline: 'Ongoing - No deadline',
      contactInfo: {
        helpline: '1800-180-1551',
        email: 'support@kcc.gov.in',
        website: 'kisancreditcard.in'
      },
      status: 'Active'
    },
    {
      id: 'soil-health',
      title: 'Soil Health Card Scheme',
      category: 'Advisory',
      description: 'Soil testing and recommendation for balanced fertilizer use',
      benefits: 'Free soil testing and customized fertilizer recommendations',
      eligibility: [
        'All farmers irrespective of land size',
        'Should provide soil samples as per guidelines',
        'Land should be used for agriculture',
        'Available for all crop types'
      ],
      documents: [
        'Farmer registration form',
        'Land ownership documents',
        'Aadhar card',
        'Contact details'
      ],
      applicationProcess: [
        'Contact local agriculture officer',
        'Collect soil sample as per guidelines',
        'Submit sample at testing center',
        'Receive soil health card within 30 days',
        'Follow recommendations for better yield'
      ],
      deadline: 'Ongoing - Apply during non-cropping season',
      contactInfo: {
        helpline: '1800-180-1551',
        email: 'shc@gov.in',
        website: 'soilhealth.dac.gov.in'
      },
      status: 'Active'
    },
    {
      id: 'organic-farming',
      title: 'Paramparagat Krishi Vikas Yojana',
      category: 'Organic Farming',
      description: 'Support for organic farming and certification',
      benefits: '₹50,000 per hectare for 3 years including certification cost',
      eligibility: [
        'Individual farmers or farmer groups',
        'Should commit to organic farming for 3 years',
        'Must follow organic farming practices',
        'Land should be suitable for organic farming'
      ],
      documents: [
        'Application form',
        'Land records',
        'Group formation certificate (if applicable)',
        'Bank account details'
      ],
      applicationProcess: [
        'Form farmer groups of 50 members',
        'Apply through District Collector',
        'Get approval from organic farming committee',
        'Start organic farming practices',
        'Regular monitoring and certification'
      ],
      deadline: 'Applications accepted twice a year',
      contactInfo: {
        helpline: '1800-180-1551',
        email: 'organic@gov.in',
        website: 'pgsindia-ncof.gov.in'
      },
      status: 'Active'
    }
  ];

  const subsidies = [
    {
      id: 'equipment-subsidy',
      title: 'Farm Equipment Subsidy',
      description: 'Subsidy for purchasing agricultural equipment and machinery',
      subsidyRate: '40-50% of equipment cost',
      maxAmount: '₹1,50,000',
      equipmentTypes: [
        'Tractors and Power Tillers',
        'Seed Drills and Planters',
        'Harvesting Equipment',
        'Irrigation Equipment',
        'Processing Machinery'
      ],
      eligibility: 'Small and marginal farmers, Women farmers get priority',
      applicationPeriod: 'April to June annually'
    },
    {
      id: 'drip-irrigation',
      title: 'Drip Irrigation Subsidy',
      description: 'Financial assistance for micro irrigation systems',
      subsidyRate: '55% for general category, 75% for SC/ST',
      maxAmount: '₹62,500 per hectare',
      equipmentTypes: [
        'Drip irrigation systems',
        'Sprinkler irrigation',
        'Micro-sprinklers',
        'Fertigation systems',
        'Water storage tanks'
      ],
      eligibility: 'All categories of farmers with minimum 0.2 hectare land',
      applicationPeriod: 'Throughout the year'
    },
    {
      id: 'seed-subsidy',
      title: 'Quality Seed Subsidy',
      description: 'Subsidy on certified seeds and planting materials',
      subsidyRate: '25-50% of seed cost',
      maxAmount: '₹25,000 per hectare',
      equipmentTypes: [
        'Certified seeds',
        'Hybrid seeds',
        'Vegetable seeds',
        'Fruit saplings',
        'Spice planting materials'
      ],
      eligibility: 'All farmers, Priority to small and marginal farmers',
      applicationPeriod: 'Before each cropping season'
    },
    {
      id: 'solar-pump',
      title: 'Solar Pump Subsidy',
      description: 'Subsidy for solar-powered irrigation pumps',
      subsidyRate: '90% for individual farmers, 95% for groups',
      maxAmount: '₹4,50,000',
      equipmentTypes: [
        'Solar water pumps',
        'Solar panels',
        'Controller systems',
        'Storage batteries',
        'Installation accessories'
      ],
      eligibility: 'Farmers with adequate water source and minimum 0.5 hectare land',
      applicationPeriod: 'March to September annually'
    }
  ];

  const policies = [
    {
      id: 'msp-policy',
      title: 'Minimum Support Price (MSP)',
      description: 'Guaranteed minimum price for 23 crops to protect farmers from price volatility',
      coverage: [
        'Cereals: Rice, Wheat, Barley, Jowar, Bajra, Maize, Ragi',
        'Pulses: Arhar, Chana, Masoor, Moong, Urad',
        'Oilseeds: Groundnut, Soybean, Sunflower, Sesame, Niger, Safflower',
        'Commercial Crops: Cotton, Sugarcane, Jute, Copra'
      ],
      benefits: 'Assured income and market stability',
      procurementAgencies: 'FCI, NAFED, State agencies'
    },
    {
      id: 'export-policy',
      title: 'Agricultural Export Policy',
      description: 'Policy framework to boost agricultural exports and farmer income',
      objectives: [
        'Double agricultural exports by 2025',
        'Make India global leader in agriculture',
        'Promote value-added exports',
        'Strengthen supply chains'
      ],
      benefits: 'Better prices for export-quality produce',
      focus: 'Organic products, processed foods, spices, fruits'
    },
    {
      id: 'fpo-policy',
      title: 'Farmer Producer Organization (FPO) Policy',
      description: 'Formation and promotion of 10,000 new FPOs',
      support: [
        'Equity grant up to ₹15 lakhs',
        'Credit guarantee up to ₹2 crores',
        'Management support for 5 years',
        'Training and capacity building'
      ],
      benefits: 'Collective bargaining power, better market access',
      targetBeneficiaries: 'Small and marginal farmers through collectivization'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    const newApplication = {
      id: Date.now(),
      ...applicationForm,
      applicationDate: new Date().toLocaleDateString(),
      status: 'Submitted',
      trackingNumber: `APP${Date.now().toString().slice(-6)}`
    };
    setApplications(prev => [...prev, newApplication]);
    setApplicationForm({
      schemeName: '',
      farmerName: '',
      phoneNumber: '',
      aadharNumber: '',
      farmSize: '',
      cropType: '',
      bankAccount: '',
      address: ''
    });
    alert(`Application submitted successfully! Tracking Number: ${newApplication.trackingNumber}`);
  };

  const tabs = [
    { id: 'schemes', label: t('government.tabs.schemes') },
    { id: 'subsidies', label: t('government.tabs.subsidies') },
    { id: 'policies', label: t('government.tabs.policies') },
    { id: 'apply', label: t('government.tabs.apply') },
    { id: 'track', label: t('government.tabs.track') }
  ];

  const renderSchemes = () => (
    <div className="schemes-section">
      <div className="section-header">
        <h2>{t('government.schemesTitle')}</h2>
        <p>{t('government.schemesDescription')}</p>
      </div>

      <div className="schemes-grid">
        {schemes.map(scheme => (
          <div key={scheme.id} className="scheme-card">
            <div className="scheme-header">
              <h3>{scheme.title}</h3>
              <span className={`scheme-status ${scheme.status.toLowerCase()}`}>
                {scheme.status}
              </span>
            </div>
            
            <div className="scheme-category">
              <span className="category-tag">{scheme.category}</span>
            </div>

            <p className="scheme-description">{scheme.description}</p>

            <div className="scheme-benefits">
              <h4>{t('government.labels.benefits')}</h4>
              <p>{scheme.benefits}</p>
            </div>

            <div className="scheme-deadline">
              <h4>{t('government.labels.applicationDeadline')}</h4>
              <p>{scheme.deadline}</p>
            </div>

            <div className="scheme-contact">
              <h4>{t('government.labels.contactInformation')}</h4>
              <div className="contact-details">
                <p><strong>{t('government.labels.helpline')}</strong> {scheme.contactInfo.helpline}</p>
                <p><strong>{t('government.labels.email')}</strong> {scheme.contactInfo.email}</p>
                <p><strong>{t('government.labels.website')}</strong> {scheme.contactInfo.website}</p>
              </div>
            </div>

            <button 
              className="scheme-details-btn"
              onClick={() => setSelectedScheme(scheme)}
            >
              {t('government.labels.viewDetails')}
            </button>
          </div>
        ))}
      </div>

      {selectedScheme && (
        <div className="scheme-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedScheme.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedScheme(null)}
              >
                {t('government.labels.close')}
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>{t('government.labels.eligibilityCriteria')}</h3>
                <ul>
                  {selectedScheme.eligibility.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3>{t('government.labels.requiredDocuments')}</h3>
                <ul>
                  {selectedScheme.documents.map((document, index) => (
                    <li key={index}>{document}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3>{t('government.labels.applicationProcess')}</h3>
                <ol>
                  {selectedScheme.applicationProcess.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubsidies = () => (
    <div className="subsidies-section">
      <div className="section-header">
        <h2>{t('government.labels.agriculturalSubsidies')}</h2>
        <p>{t('government.labels.financialAssistance')}</p>
      </div>

      <div className="subsidies-grid">
        {subsidies.map(subsidy => (
          <div key={subsidy.id} className="subsidy-card">
            <div className="subsidy-header">
              <h3>{subsidy.title}</h3>
              <div className="subsidy-rate">{subsidy.subsidyRate}</div>
            </div>

            <p className="subsidy-description">{subsidy.description}</p>

            <div className="subsidy-amount">
              <span className="amount-label">{t('government.labels.maximumAmount')}</span>
              <span className="amount-value">{subsidy.maxAmount}</span>
            </div>

            <div className="subsidy-equipment">
              <h4>{t('government.labels.coveredEquipment')}</h4>
              <ul>
                {subsidy.equipmentTypes.map((equipment, index) => (
                  <li key={index}>{equipment}</li>
                ))}
              </ul>
            </div>

            <div className="subsidy-details">
              <div className="detail-item">
                <strong>{t('government.labels.eligibility')}</strong>
                <span>{subsidy.eligibility}</span>
              </div>
              <div className="detail-item">
                <strong>{t('government.labels.applicationPeriod')}</strong>
                <span>{subsidy.applicationPeriod}</span>
              </div>
            </div>

            <button className="apply-subsidy-btn">
              {t('government.labels.applyForSubsidy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="policies-section">
      <div className="section-header">
        <h2>{t('government.labels.agriculturalPolicies')}</h2>
        <p>{t('government.labels.nationalStatePolicies')}</p>
      </div>

      <div className="policies-list">
        {policies.map(policy => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <h3>{policy.title}</h3>
            </div>

            <p className="policy-description">{policy.description}</p>

            {policy.coverage && (
              <div className="policy-section">
                <h4>{t('government.labels.coverage')}</h4>
                <ul>
                  {policy.coverage.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policy.objectives && (
              <div className="policy-section">
                <h4>{t('government.labels.objectives')}</h4>
                <ul>
                  {policy.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {policy.support && (
              <div className="policy-section">
                <h4>{t('government.labels.supportProvided')}</h4>
                <ul>
                  {policy.support.map((support, index) => (
                    <li key={index}>{support}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="policy-benefits">
              <h4>{t('government.labels.benefits')}</h4>
              <p>{policy.benefits}</p>
            </div>

            {policy.procurementAgencies && (
              <div className="policy-agencies">
                <strong>{t('government.labels.procurementAgencies')}</strong>
                <span>{policy.procurementAgencies}</span>
              </div>
            )}

            {policy.focus && (
              <div className="policy-focus">
                <strong>{t('government.labels.focusAreas')}</strong>
                <span>{policy.focus}</span>
              </div>
            )}

            {policy.targetBeneficiaries && (
              <div className="policy-target">
                <strong>{t('government.labels.targetBeneficiaries')}</strong>
                <span>{policy.targetBeneficiaries}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplicationForm = () => (
    <div className="application-section">
      <div className="section-header">
        <h2>{t('government.labels.applyForSchemes')}</h2>
        <p>{t('government.labels.submitApplication')}</p>
      </div>

      <form onSubmit={handleApplicationSubmit} className="application-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="schemeName">{t('government.labels.selectScheme')}</label>
            <select
              id="schemeName"
              name="schemeName"
              value={applicationForm.schemeName}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('government.labels.chooseScheme')}</option>
              {schemes.map(scheme => (
                <option key={scheme.id} value={scheme.title}>{scheme.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="farmerName">{t('government.labels.farmerName')}</label>
            <input
              type="text"
              id="farmerName"
              name="farmerName"
              value={applicationForm.farmerName}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterFullName')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">{t('government.labels.phoneNumber')}</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={applicationForm.phoneNumber}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterPhoneNumber')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aadharNumber">{t('government.labels.aadharNumber')}</label>
            <input
              type="text"
              id="aadharNumber"
              name="aadharNumber"
              value={applicationForm.aadharNumber}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterAadharNumber')}
              maxLength="12"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="farmSize">{t('government.labels.farmSize')}</label>
            <input
              type="number"
              id="farmSize"
              name="farmSize"
              value={applicationForm.farmSize}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterFarmSize')}
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cropType">{t('government.labels.primaryCrop')}</label>
            <select
              id="cropType"
              name="cropType"
              value={applicationForm.cropType}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('government.labels.selectPrimaryCrop')}</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="coconut">Coconut</option>
              <option value="pepper">Black Pepper</option>
              <option value="cardamom">Cardamom</option>
              <option value="rubber">Rubber</option>
              <option value="banana">Banana</option>
              <option value="sugarcane">Sugarcane</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bankAccount">{t('government.labels.bankAccountNumber')}</label>
            <input
              type="text"
              id="bankAccount"
              name="bankAccount"
              value={applicationForm.bankAccount}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterBankAccount')}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">{t('government.labels.address')}</label>
            <textarea
              id="address"
              name="address"
              value={applicationForm.address}
              onChange={handleInputChange}
              placeholder={t('government.labels.enterCompleteAddress')}
              rows="3"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-application-btn">
          {t('government.labels.submitApplication')}
        </button>
      </form>
    </div>
  );

  const renderTrackApplication = () => (
    <div className="track-section">
      <div className="section-header">
        <h2>{t('government.labels.trackApplications')}</h2>
        <p>{t('government.labels.monitorStatus')}</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <div className="no-app-icon">
            📋
          </div>
          <h3>{t('government.labels.noApplicationsFound')}</h3>
          <p>{t('government.labels.noApplicationsMessage')}</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(app => (
            <div key={app.id} className="application-card">
              <div className="app-header">
                <h3>{app.schemeName}</h3>
                <span className={`app-status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>

              <div className="app-details">
                <div className="app-info">
                  <p><strong>{t('government.labels.trackingNumber')}</strong> {app.trackingNumber}</p>
                  <p><strong>{t('government.labels.applicationDate')}</strong> {app.applicationDate}</p>
                  <p><strong>{t('government.labels.farmerName')}</strong> {app.farmerName}</p>
                  <p><strong>{t('government.labels.farmSize')}</strong> {app.farmSize} hectares</p>
                </div>

                <div className="app-progress">
                  <div className="progress-steps">
                    <div className="step completed">
                      <div className="step-icon">1</div>
                      <span>{t('government.labels.submitted')}</span>
                    </div>
                    <div className="step">
                      <div className="step-icon">2</div>
                      <span>{t('government.labels.underReview')}</span>
                    </div>
                    <div className="step">
                      <div className="step-icon">3</div>
                      <span>{t('government.labels.approved')}</span>
                    </div>
                    <div className="step">
                      <div className="step-icon">4</div>
                      <span>{t('government.labels.payment')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="government-services">
      <Navbar />
      
      <div className="gov-services-container">
        <div className="services-header">
          <div className="header-content">
            <h1>{t('government.title')}</h1>
            <p>{t('government.description')}</p>
          </div>
          <div className="user-info">
            <span>{t('government.welcome')}, {user?.name || t('government.farmer')}</span>
          </div>
        </div>

        <div className="services-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="services-content">
          {activeTab === 'schemes' && renderSchemes()}
          {activeTab === 'subsidies' && renderSubsidies()}
          {activeTab === 'policies' && renderPolicies()}
          {activeTab === 'apply' && renderApplicationForm()}
          {activeTab === 'track' && renderTrackApplication()}
        </div>
      </div>
    </div>
  );
};

export default GovernmentServices;
