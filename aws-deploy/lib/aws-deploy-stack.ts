import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class AwsDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'cdk-rss-bucket',
      //websiteIndexDocument: "index.html",
      // versioned: false,
      // publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
      enforceSSL: true,
    });

    // Create Origin Access Identity (OAI) for CloudFront
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      'CloudFrontOriginAccessIdentity',
      { comment: 'Allow CloudFront to access the website bucket' },
    );

    // Grant read permissions to CloudFront
    siteBucket.grantRead(cloudfrontOAI);

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        //origin: new origins.S3Origin(siteBucket, { originAccessIdentity: cloudfrontOAI }),
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(siteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../frontend/dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.domainName}`,
      description: 'The distribution URL',
      exportName: 'CloudfrontURL',
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: `https://${siteBucket.bucketName}.s3.${this.region}.amazonaws.com`,
      description: 'The name of the S3 bucket',
      exportName: 'BucketName',
    });
  }
}
