import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    basicDetails: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
            default: ""
        },
        nationality: {
            type: String,
            default: ""
        },
        usmleId: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        medicalSchool: {
            type: String,
        },
        mbbsRegNo: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            default: null
        },
        photoKey: {
            type: String,
            default: null
        },
        passportFront: {
            type: String,
            default: null
        },
        passportFrontKey: {
            type: String,
            default: null
        },
        passportBack: {
            type: String,
            default: null
        },
        passportBackKey: {
            type: String,
            default: null
        },
        aadharFront: {
            type: String,
            default: null
        },
        aadharFrontKey: {
            type: String,
            default: null
        },
        aadharBack: {
            type: String,
            default: null
        },
        aadharBackKey: {
            type: String,
            default: null
        },
        languages: [{
            language: {
                type: String,
                enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Portuguese', 'Russian', 'Japanese']
            },
            fluency: {
                type: String,
                enum: ['native', 'fluent', 'conversational', 'basic', 'beginner']
            }
        }]
    },
    education: {
        schooling: {
            schoolName: {
                type: String,
                default: ""
            },
            board: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            startYear: {
                type: String,
                default: ""
            },
            endYear: {
                type: String,
                default: ""
            },
            grade: {
                type: String,
                default: ""
            }
        },
        college: {
            collegeName: {
                type: String,
                default: ""
            },
            stream: {
                type: String,
                enum: ['Science', 'Commerce', 'Arts', 'Other', ''],
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            startYear: {
                type: String,
                default: ""
            },
            endYear: {
                type: String,
                default: ""
            },
            eleventhGrade: {
                type: String,
                default: ""
            },
            twelfthGrade: {
                type: String,
                default: ""
            }
        },
        graduation: {
            universityName: {
                type: String,
                default: ""
            },
            degree: {
                type: String,
                enum: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Sc', 'Other', ''],
                default: ""
            },
            specialization: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            country: {
                type: String,
                default: ""
            },
            startDate: {
                type: String,
                default: ""
            },
            endDate: {
                type: String,
                default: ""
            },
            firstYearPercentage: {
                type: String,
                default: ""
            },
            secondYearPercentage: {
                type: String,
                default: ""
            },
            thirdYearPercentage: {
                type: String,
                default: ""
            },
            finalYearPercentage: {
                type: String,
                default: ""
            },
            overallGrade: {
                type: String,
                default: ""
            },
            classType: {
                type: String,
                enum: ['First Class with Distinction', 'First Class', 'Second Class', 'Pass Class', ''],
                default: ""
            }
        },
        postGraduation: {
            universityName: {
                type: String,
                default: ""
            },
            degree: {
                type: String,
                enum: ['MD', 'MS', 'DNB', 'DM', 'MCh', 'M.Sc', 'Other', ''],
                default: ""
            },
            specialization: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            country: {
                type: String,
                default: ""
            },
            startDate: {
                type: String,
                default: ""
            },
            endDate: {
                type: String,
                default: ""
            },
            status: {
                type: String,
                enum: ['Completed', 'Pursuing', 'Dropped', ''],
                default: ""
            },
            overallGrade: {
                type: String,
                default: ""
            }
        }
    },
    usmleScores: {
        step1Status: {
            type: String,
            enum: ['not-taken', 'pass', 'fail', ''],
            default: ''
        },
        step1Cert: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            uploadDate: {
                type: String,
                default: null
            }
        },
        step2ckScore: {
            type: String,
            default: ""
        },
        step2Cert: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            uploadDate: {
                type: String,
                default: null
            }
        },
        step2csStatus: {
            type: String,
            enum: ['not-taken', 'pass', 'fail', 'waived', ''],
            default: ''
        },
        oetScore: {
            type: String,
            default: ""
        },
        oetCert: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            uploadDate: {
                type: String,
                default: null
            }
        },
        ecfmgCertified: {
            type: Boolean,
            default: false
        }
    },
    usClinicalExperience: {
        list: [{
            title: {
                type: String,
                default: ""
            },
            hospital: {
                type: String,
                default: ""
            },
            location: {
                type: String,
                default: ""
            },
            duration: {
                type: String,
                default: ""
            },
            startDate: {
                type: String,
                default: ""
            },
            endDate: {
                type: String,
                default: ""
            },
            description: {
                type: String,
                default: ""
            },
            supervisor: {
                type: String,
                default: ""
            }
        }]
    },
    clinicalExperiences: [{
        title: String,
        hospital: String,
        duration: String,
        description: String
    }],
    skills: {
        skillsList: {
            type: String,
            default: ""
        },
        supportingDocuments: [{
            id: {
                type: Number
            },
            name: {
                type: String
            },
            url: {
                type: String
            },
            key: {
                type: String
            },
            type: {
                type: String
            },
            size: {
                type: Number
            }
        }]
    },
    professionalExperiences: [{
        position: String,
        organization: String,
        duration: String,
        description: String
    }],
    volunteerExperiences: [{
        organization: String,
        role: String,
        duration: String,
        description: String
    }],
    significantAchievements: {
        type: String,
        default: ""
    },
    achievements: [{
        id: Number,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        date: {
            type: String,
            default: ""
        },
        attachmentType: {
            type: String,
            enum: ['none', 'url'],
            default: 'none'
        },
        url: {
            type: String,
            default: ""
        }
    }],
    publications: [{
        title: {
            type: String,
            required: true
        },
        journal: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['research-article', 'case-report', 'review-article', 'conference-paper'],
            default: 'research-article'
        },
        supportingDocument: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            fileSize: {
                type: Number,
                default: null
            }
        }
    }],
    conferences: [{
        name: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        certificateAwarded: {
            type: Boolean,
            default: false
        },
        supportingDocument: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            fileSize: {
                type: Number,
                default: null
            }
        }
    }],
    workshops: [{
        name: {
            type: String,
            required: true
        },
        organizer: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        awards: {
            type: String,
            default: ""
        },
        date: {
            type: String,
            default: ""
        }
    }],
    emrRcmTraining: {
        emrSystems: [{
            type: String
        }],
        rcmTraining: {
            type: Boolean,
            default: false
        },
        duration: {
            type: String,
            default: ""
        }
    },
    aclsBls: {
        aclsCertified: {
            type: Boolean,
            default: false
        },
        blsCertified: {
            type: Boolean,
            default: false
        },
        aclsIssueDate: {
            type: String,
            default: ""
        },
        aclsExpiryDate: {
            type: String,
            default: ""
        },
        blsIssueDate: {
            type: String,
            default: ""
        },
        blsExpiryDate: {
            type: String,
            default: ""
        },
        provider: {
            type: String,
            default: ""
        }
    },
    workExperience: [{
        position: {
            type: String,
            default: ""
        },
        organization: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        startDate: {
            type: String,
            default: ""
        },
        endDate: {
            type: String,
            default: ""
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            default: ""
        }
    }],
    govCV: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        originalName: {
            type: String
        },
        filename: {
            type: String
        },
        fileId: {
            type: String
        },
        size: {
            type: Number
        },
        uploadDate: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            default: 'government'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const CV = mongoose.model("CV", cvSchema);