# React Shop with CloudFront Deployment

This repository contains two interconnected projects: a React-based frontend application and an AWS CDK application for deploying the frontend to AWS with CloudFront.

## Project Structure

The repository is organized as follows:

```
├── aws-deploy/     # AWS Deployment App (CDK)
├── frontend/       # React Frontend (React-shop-cloudfront)
└── README.md       # This main README file
```

## Project Details

### 1. Frontend: React Shop (React-shop-cloudfront)

***Project updated as of February 2025. All dependencies have been upgraded to their latest versions, and code adjustments have been made to ensure compatibility.***

*   **Description:** The frontend portion of the website, built using React. This project handles the user interface and client-side logic.
*   **Technology Stack:** React, JavaScript/TypeScript (depending on your setup), potentially other frontend libraries/frameworks.
*   **[➡️  Click here for the Frontend README](frontend/README.md)**

### 2. AWS Deployment App

*   **Description:** An AWS CDK application written in Node.js and TypeScript, responsible for deploying the frontend to AWS using CloudFront.
*   **Technology Stack:** AWS CDK, Node.js, TypeScript, CloudFront, S3 (and other AWS services you utilize).
*   **[➡️  Click here for the AWS Deployment App README](aws-deploy/README.md)**
  
#### **Automated Deployment (AWS CDK)**

**Bucket URL:** https://cdk-rss-bucket.s3.eu-north-1.amazonaws.com (Expected 403 Access Denied)

**CloudFrontURL:** https://db5i175ksp8cp.cloudfront.net

## Getting Started

To get started with either project, please refer to their individual README files linked above. Each README provides detailed instructions on installation, configuration, and usage.
