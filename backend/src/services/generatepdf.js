import PDFDocument from 'pdfkit';
import axios from 'axios';

const COLORS = {
    primary: '#000000',
    accent: '#0066cc',
    text: '#000000',
    darkGray: '#4a4a4a',
    lightGray: '#666666',
    sectionLine: '#cccccc'
};

const FONTS = {
    bold: 'Helvetica-Bold',
    regular: 'Helvetica',
    italic: 'Helvetica-Oblique'
};

const SIZES = {
    name: 20,
    contactInfo: 9,
    sectionHeading: 11,
    jobTitle: 10,
    body: 9,
    small: 8,
    lineHeight: 12
};

const MARGINS = {
    top: 40,
    bottom: 50,
    left: 50,
    right: 50
};

const LAYOUT = {
    leftColumnX: 50,
    leftColumnWidth: 180,
    rightColumnX: 240,
    rightColumnWidth: 315
};

async function fetchImageBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

function addHeader(doc, data) {
    const { fullName, email, phone, city, state, country } = data.basicDetails;
    
    doc.fontSize(SIZES.name).fillColor(COLORS.primary).font(FONTS.bold)
        .text(fullName.toUpperCase(), MARGINS.left, MARGINS.top);
    
    const contactY = MARGINS.top + 25;
    doc.fontSize(SIZES.contactInfo).fillColor(COLORS.darkGray).font(FONTS.regular);
    
    let contactLine1 = [];
    let contactLine2 = [];
    
    if (email) contactLine1.push(email);
    if (phone) contactLine1.push(phone);
    
    if (city) contactLine2.push(city);
    if (state) contactLine2.push(state);
    if (country) contactLine2.push(country);
    
    if (contactLine1.length > 0) {
        doc.text(contactLine1.join(' | '), MARGINS.left, contactY);
    }
    
    if (contactLine2.length > 0) {
        doc.text(contactLine2.join(', '), MARGINS.left, contactY + 11);
    }
    
    return contactY + 30;
}

function addLeftColumnSection(doc, title, y) {
    doc.fontSize(SIZES.sectionHeading).fillColor(COLORS.primary).font(FONTS.bold)
        .text(title.toUpperCase(), LAYOUT.leftColumnX, y);
    
    const lineY = y + 14;
    doc.moveTo(LAYOUT.leftColumnX, lineY)
        .lineTo(LAYOUT.leftColumnX + LAYOUT.leftColumnWidth, lineY)
        .strokeColor(COLORS.sectionLine)
        .lineWidth(0.5)
        .stroke();
    
    return lineY + 8;
}

function addEducation(doc, data, startY) {
    let y = addLeftColumnSection(doc, 'Education', startY);
    
    const educationEntries = [];
    
    if (data.education?.graduation?.universityName) {
        const grad = data.education.graduation;
        educationEntries.push({
            degree: grad.degree || 'MBBS',
            institution: grad.universityName,
            location: [grad.city, grad.country].filter(Boolean).join(', '),
            year: grad.endDate ? grad.endDate.split('-')[0] : ''
        });
    }
    
    if (data.education?.postGraduation?.universityName) {
        const pg = data.education.postGraduation;
        educationEntries.push({
            degree: pg.degree || 'Post Graduation',
            institution: pg.universityName,
            location: [pg.city, pg.country].filter(Boolean).join(', '),
            year: pg.endDate ? pg.endDate.split('-')[0] : ''
        });
    }
    
    educationEntries.forEach((entry, index) => {
        if (index > 0) y += 12;
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(entry.degree, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += SIZES.lineHeight;
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
            .text(entry.institution, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 10;
        
        if (entry.location) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic)
                .text(entry.location, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
        
        if (entry.year) {
            doc.fillColor(COLORS.darkGray)
                .text(entry.year, LAYOUT.leftColumnX, y);
            y += 10;
        }
    });
    
    return y + 15;
}

function addSkillsSection(doc, data, startY) {
    if (!data.skills?.skillsList) return startY;
    
    let y = addLeftColumnSection(doc, 'Skills', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    const skills = data.skills.skillsList.split(',').map(s => s.trim()).filter(Boolean);
    
    skills.forEach(skill => {
        doc.text(`• ${skill}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
    });
    
    return y + 15;
}

function addCertifications(doc, data, startY) {
    const certs = [];
    
    if (data.aclsBls?.aclsCertified) {
        certs.push({ name: 'ACLS', date: data.aclsBls.aclsExpiryDate });
    }
    if (data.aclsBls?.blsCertified) {
        certs.push({ name: 'BLS', date: data.aclsBls.blsExpiryDate });
    }
    if (data.usmleScores?.ecfmgCertified) {
        certs.push({ name: 'ECFMG Certified', date: null });
    }
    
    if (certs.length === 0) return startY;
    
    let y = addLeftColumnSection(doc, 'Certifications', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    certs.forEach(cert => {
        doc.font(FONTS.bold).text(cert.name, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        if (cert.date) {
            doc.font(FONTS.regular).fillColor(COLORS.darkGray)
                .text(`Expires: ${cert.date}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 11;
        }
    });
    
    return y + 15;
}

function addRightColumnSection(doc, title, y) {
    doc.fontSize(SIZES.sectionHeading).fillColor(COLORS.primary).font(FONTS.bold)
        .text(title.toUpperCase(), LAYOUT.rightColumnX, y);
    
    const lineY = y + 14;
    doc.moveTo(LAYOUT.rightColumnX, lineY)
        .lineTo(doc.page.width - MARGINS.right, lineY)
        .strokeColor(COLORS.sectionLine)
        .lineWidth(0.5)
        .stroke();
    
    return lineY + 8;
}

function addExperienceSection(doc, experiences, title, startY) {
    if (!experiences || experiences.length === 0) return startY;
    
    let y = addRightColumnSection(doc, title, startY);
    
    experiences.forEach((exp, index) => {
        if (index > 0) y += 15;
        
        const titleText = exp.title || exp.position || exp.role || '';
        const orgText = exp.hospital || exp.organization || '';
        
        if (titleText) {
            doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
                .text(titleText, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += SIZES.lineHeight;
        }
        
        if (orgText) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(orgText, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
        
        const locationParts = [];
        if (exp.city) locationParts.push(exp.city);
        if (exp.state) locationParts.push(exp.state);
        if (exp.country) locationParts.push(exp.country);
        
        const dateStr = exp.duration || 
                       (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '');
        
        if (locationParts.length > 0 || dateStr) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic);
            const infoLine = [];
            if (locationParts.length > 0) infoLine.push(locationParts.join(', '));
            if (dateStr) infoLine.push(dateStr);
            doc.text(infoLine.join(' | '), LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
        
        if (exp.description) {
            y += 3;
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
            const lines = exp.description.split('\n').filter(l => l.trim());
            lines.forEach(line => {
                doc.text(`• ${line.trim()}`, LAYOUT.rightColumnX, y, { 
                    width: LAYOUT.rightColumnWidth,
                    align: 'left'
                });
                y += doc.heightOfString(line, { width: LAYOUT.rightColumnWidth }) + 2;
            });
        }
    });
    
    return y + 10;
}

function addPublications(doc, data, startY) {
    if (!data.publications || data.publications.length === 0) return startY;
    
    let y = addRightColumnSection(doc, 'Publications', startY);
    
    data.publications.forEach((pub, index) => {
        if (index > 0) y += 10;
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        doc.text(`${index + 1}. ${pub.title}`, LAYOUT.rightColumnX, y, {
            width: LAYOUT.rightColumnWidth
        });
        y += doc.heightOfString(pub.title, { width: LAYOUT.rightColumnWidth }) + 2;
        
        doc.font(FONTS.italic).fillColor(COLORS.darkGray);
        doc.text(`${pub.journal}, ${pub.year}`, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
        y += 10;
    });
    
    return y + 10;
}

export async function generateCVPDF(cvData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { 
                    top: MARGINS.top, 
                    bottom: MARGINS.bottom, 
                    left: MARGINS.left, 
                    right: MARGINS.right 
                },
                bufferPages: true
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            let headerEndY = addHeader(doc, cvData);
            
            let leftY = headerEndY + 10;
            let rightY = headerEndY + 10;
            
            leftY = addEducation(doc, cvData, leftY);
            leftY = addSkillsSection(doc, cvData, leftY);
            leftY = addCertifications(doc, cvData, leftY);
            
            rightY = addExperienceSection(doc, cvData.usClinicalExperience?.list, 'Clinical Experience', rightY);
            rightY = addExperienceSection(doc, cvData.clinicalExperiences, 'Clinical Experience', rightY);
            rightY = addExperienceSection(doc, cvData.workExperience, 'Work Experience', rightY);
            rightY = addExperienceSection(doc, cvData.volunteerExperiences, 'Volunteer Experience', rightY);
            rightY = addPublications(doc, cvData, rightY);
            
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(7).fillColor(COLORS.lightGray).text(
                    `${cvData.basicDetails.fullName} - Page ${i + 1}`,
                    MARGINS.left,
                    doc.page.height - 30,
                    { align: 'center', width: doc.page.width - MARGINS.left - MARGINS.right }
                );
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}