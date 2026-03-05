"use client";
import "@/styles/pdfForm.css";
import "@/styles/form.css"
import { useEffect, useState } from "react";

interface PDFTemplateProps {
  data: any;
}

export default function PDFTemplate({ data }: PDFTemplateProps) {
  const [passportUrl, setPassportUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data?.uploadPassport instanceof File) {
      const url = URL.createObjectURL(data.uploadPassport);
      setPassportUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof data?.uploadPassport === "string") {
      setPassportUrl(data.uploadPassport);
    }
  }, [data?.uploadPassport]);

  useEffect(() => {
    if (data?.signature instanceof File) {
      const url = URL.createObjectURL(data.signature);
      setSignatureUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (
      typeof data?.signature === "string" &&
      data.signature.startsWith("data:")
    ) {
      setSignatureUrl(data.signature);
    }
  }, [data?.signature]);

  return (
    <div 
      id="pdf-template" 
      className="pdf-template-container"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        padding: '20mm',
        backgroundColor: 'white',
        fontSize: '11pt',
      }}
    >
      <h1>SOHCAHTOA INVESTMENT LIMITED - EMPLOYEE DETAILS FORM</h1>

      {/* PAGE 1 */}
      <div style={{ pageBreakAfter: "always" }} className="pdf-page"> 
        {/* Header */}
        <div className="pdf-sub-header">
          <div className="pdf-logo-container">
            <img
              src="/SIL logo.689b601bda7341.19720820.png"
              alt="SIL logo"
              width={120}
              height={80}
            />
          </div>
          <p>
            2 Floor, 11961 Bishop Oluwola Street
            <br />
            Victoria Island Lagos
          </p>
        </div>
        
        {/* Form Fields Section */}
        <div className="pdf-form-content">
          

        <div className="pdf-personal-details">
          {passportUrl && (
            <img
              src={passportUrl}
              alt={data.Surname}
              width={80}
              height={80}
              className="pdf-passport"
            />
          )}
        </div>
          {/* PART A */}

          <section>  
            <h3>PART A: PROFILE DETAILS (Kindly complete the details below accurately)</h3>
           <div className="main-input-pdf-container">
             <div className="pdf-sub-section-container">
              <h4>Contract Type</h4>
              <div className="pdf-input">{data.contractType}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>If Others</h4>
              <div className="pdf-input">{data.ifOthers}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.title}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.Surname}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstName}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Middle Name</h4>
              <div className="pdf-input">{data.middleName}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Maiden Name</h4>
              <div className="pdf-input">{data.maidenName}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Job Title</h4>
              <div className="pdf-input">{data.jobTitle}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Department</h4>
              <div className="pdf-input">{data.department}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Location</h4>
              <div className="pdf-input">{data.location}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Start Date</h4>
              <div className="pdf-input">{(() => { const _d = data.startDate ? new Date(data.startDate + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (data.startDate || ''); })()}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Current Address</h4>
              <div className="pdf-input">{data.currentAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Permanent Address</h4>
              <div className="pdf-input">{data.permanentAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.phoneNo}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Email</h4>
              <div className="pdf-input">{data.email}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Confirm Email</h4>
              <div className="pdf-input">{data.confirmEmail}</div>
            </div>
           </div>
          </section>

          {/* PART B */}
          <section>  
            <h3>PART B: BIODATA (Kindly complete the details below accurately)</h3>
            <div className="main-input-pdf-container">
              <div className="pdf-sub-section-container">
              <h4>DOB</h4>
              <div className="pdf-input">{(() => { const _d = data.DOB ? new Date(data.DOB + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (data.DOB || ''); })()}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Age</h4>
              <div className="pdf-input">{data.age}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Gender</h4>
              <div className="pdf-input">{data.gender}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>State Of Origin</h4>
              <div className="pdf-input">{data.stateOfOrigin}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>LGA</h4>
              <div className="pdf-input">{data.LGA}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Marital Status</h4>
              <div className="pdf-input">{data.maritalStatus}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Religion</h4>
              <div className="pdf-input">{data.Religion}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Ethnicity</h4>
              <div className="pdf-input">{data.Ethnicity}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>NIN</h4>
              <div className="pdf-input">{data.NIN}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Physically Challenged</h4>
              <div className="pdf-input">{data.PhysicallyChallenged}</div>
            </div>
            </div>
            
            {/* Father Details */}
            <div className="pdf-detail-container">
              <h4>Father's Information</h4>
            <div className="main-input-pdf-container">
              <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.titleFather}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.SurnameFather}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstNameFather}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Address</h4>
              <div className="pdf-input">{data.fatherAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.fatherPhoneNo}</div>
            </div>
            </div>
            </div>

            {/* Mother Details */}
           <div className="pdf-detail-container">
             <h4>Mother's Information</h4>
<div className="main-input-pdf-container">
              <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.titleMother}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.SurnameMother}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstNameMother}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Address</h4>
              <div className="pdf-input">{data.motherAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.motherPhoneNo}</div>
            </div>
</div>
           </div>

            {/* Spouse Details */}
            <div className="pdf-detail-container">
              <h4>Spouse Information</h4>
<div className="main-input-pdf-container">
             <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.titleSpouse}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.SurnameSpouse}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstNameSpouse}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Address</h4>
              <div className="pdf-input">{data.spouseAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.spousePhoneNo}</div>
            </div>
             </div>
            </div>
          </section>
        </div>
      </div>


      {/* PAGE 2 - PART C: DEPENDENTS */}
      <div style={{ pageBreakAfter: "always" }} className="pdf-page">
          <section>
            <h3>PART C: DEPENDENT/NEXT OF KIN/EMERGENCY CONTACT DETAILS (Kindly complete the details below accurately)</h3>
            
            {/* Dependents Table */}
            <div className="pdf-detail-container">
              <h4>Dependents</h4>
            {data.dependent && data.dependent.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Age</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dependent.map((dep: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dep.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dep.age}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dep.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No dependents listed</p>
            )}
            </div>
            

            {/* Next of Kin */}
           <div className="pdf-detail-container">
             <h4>Next of Kin</h4>
           <div className="main-input-pdf-container">
             <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.titleKin}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.SurnameKin}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstNameKin}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Address</h4>
              <div className="pdf-input">{data.kinAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.kinPhoneNo}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Relationship</h4>
              <div className="pdf-input">{data.relationshipKin}</div>
            </div>
           </div>
           </div>

            {/* Emergency Contact */}
          <div className="pdf-detail-container">
            <h4>Emergency Contact</h4>
            <div className="main-input-pdf-container">
            <div className="pdf-sub-section-container">
              <h4>Title</h4>
              <div className="pdf-input">{data.titleEmergency}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Surname</h4>
              <div className="pdf-input">{data.SurnameEmergency}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>First Name</h4>
              <div className="pdf-input">{data.firstNameEmergency}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Address</h4>
              <div className="pdf-input">{data.emergencyAddress}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Phone No</h4>
              <div className="pdf-input">{data.emergencyPhoneNo}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Relationship</h4>
              <div className="pdf-input">{data.relationshipEmergency}</div>
            </div></div></div>
          </section>
      </div>


      {/* PAGE 3 - PART D: EDUCATION */}
      <div style={{ pageBreakAfter: "always" }} className="pdf-page">
          <section>
            <h3>PART D: EDUCATION/PROFESSIONAL TRAINING HISTORY (Kindly complete the details below accurately)</h3>
            
            {/* School History Table */}
            <div className="pdf-detail-container">
            <h4>Educational History</h4>
            {data.school && data.school.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '1px solid #ddd',
                fontSize: '9pt'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Institution</th>
                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Degree</th>
                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>From</th>
                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>To</th>
                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.school.map((sch: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '6px' }}>{sch.nameOfInstitution}</td>
                      <td style={{ border: '1px solid #ddd', padding: '6px' }}>{sch.degreeObtained}</td>
                      <td style={{ border: '1px solid #ddd', padding: '6px' }}>{(() => { const _d = sch.from ? new Date(sch.from + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (sch.from || ''); })()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '6px' }}>{(() => { const _d = sch.to ? new Date(sch.to + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (sch.to || ''); })()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '6px' }}>{sch.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No educational history listed</p>
            )}</div>

            {/* Professional Certifications Table */}
            <div className="pdf-detail-container">
            <h4>Professional Certifications</h4>
            {data.professional && data.professional.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Certification</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Award</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {data.professional.map((prof: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.certification}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.award}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prof.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No professional certifications listed</p>
            )}</div>
          </section>
      </div>


      {/* PAGE 4 - PART E: EMPLOYMENT HISTORY */}
      <div style={{ pageBreakAfter: "always" }} className="pdf-page">
          <section>
            <h3>PART E: EMPLOYMENT HISTORY/PENSION AND BANK DETAILS (Kindly complete the details below accurately)</h3>
            
            {/* Employment History Table */}
            <div className="pdf-detail-container">
            <h4>Employment History</h4>
            {data.employmentHistory && data.employmentHistory.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '1px solid #ddd',
                fontSize: '8pt'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>Company</th>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>Address</th>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>From</th>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>To</th>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>Duration</th>
                    <th style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'left' }}>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employmentHistory.map((emp: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{emp.company}</td>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{emp.address}</td>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{(() => { const _d = emp.from ? new Date(emp.from + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (emp.from || ''); })()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{(() => { const _d = emp.to ? new Date(emp.to + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (emp.to || ''); })()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{emp.durationOfService}</td>
                      <td style={{ border: '1px solid #ddd', padding: '5px' }}>{emp.designation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No employment history listed</p>
            )}</div>

            {/* Previous Employers Table */}
            <div className="pdf-detail-container">
            <h4>Previous Employers References</h4>
            {data.previousEmployers && data.previousEmployers.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Company</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Position</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {data.previousEmployers.map((prev: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prev.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prev.company}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prev.position}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prev.contactDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No previous employers listed</p>
            )}
</div>
            {/* Pension Details */}
            <div className="pdf-detail-container">
            <h4>Pension Details</h4>
            <div className="main-input-pdf-container">
            <div className="pdf-sub-section-container">
              <h4>Pension Fund Administrator</h4>
              <div className="pdf-input">{data.pensionFund}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Pension PIN</h4>
              <div className="pdf-input">{data.pensionPin}</div>
            </div></div></div>

            {/* Bank Details */}
            <div className="pdf-detail-container">
            <h4>Bank Details</h4>
            <div className="main-input-pdf-container">
            <div className="pdf-sub-section-container">
              <h4>Bank Name</h4>
              <div className="pdf-input">{data.bankName}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Account Name</h4>
              <div className="pdf-input">{data.accountName}</div>
            </div>
            <div className="pdf-sub-section-container">
              <h4>Account Number</h4>
              <div className="pdf-input">{data.accountNumber}</div>
            </div></div></div>
          </section>
      </div>


      {/* PAGE 5 - DECLARATION & SIGNATURE */}
      <div style={{ pageBreakAfter: "always" }} className="pdf-page">
          <h3>PART F: OTHER CIVIC DETAILS/SIGNATURE/DATE/PASSPORT PHOTOGRAPH (Kindly complete the details below accurately)</h3>
<div className="main-input-pdf-container">
        <div className="pdf-sub-section-container">
              <h4>Convicted Crime</h4>
              <div className="pdf-input">{data.convictedCrime}</div>
            </div>

           <div className="pdf-sub-section-container">
              <h4>if Others</h4>
              <div className="pdf-input">{data.ifOthers}</div>
            </div>  </div>
        <div className="pdf-signature-container">
          <div className="pdf-sub-section-container">
            <h4>Date</h4>
            <div style={{ 
              borderBottom: '2px solid #d1d5db',
              paddingBottom: '8px',
              minHeight: '30px',
              minWidth: '150px'
            }}>
              {(() => { const _d = data.date ? new Date(data.date + 'T00:00:00') : null; return _d && !isNaN(_d.getTime()) ? `${String(_d.getDate()).padStart(2,'0')}/${String(_d.getMonth()+1).padStart(2,'0')}/${_d.getFullYear()}` : (data.date || ''); })()}
            </div>
          </div>
          
          <div className="pdf-sub-section-container">
            <h4>Signature</h4>
            <div style={{
              borderBottom: '2px solid #d1d5db',
              minHeight: '80px',
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {signatureUrl && (
                <img
                  src={signatureUrl}
                  alt="Signature"
                  style={{
                    maxHeight: '60px',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}