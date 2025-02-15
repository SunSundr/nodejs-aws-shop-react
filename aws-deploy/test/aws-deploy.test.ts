import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { AwsDeployStack } from '../lib/aws-deploy-stack';

test('S3 Bucket and CloudFront Created with OAI', () => {
  const app = new cdk.App();
  const stack = new AwsDeployStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'cdk-rss-bucket',
  });

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          DomainName: Match.anyValue(),
          S3OriginConfig: {
            OriginAccessIdentity: Match.objectLike({
              'Fn::Join': Match.anyValue(),
            }),
          },
        }),
      ]),
    },
  });

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultRootObject: 'index.html',
    },
  });

  template.hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: 'Allow',
          Principal: {
            CanonicalUser: Match.anyValue(),
          },
          Action: 's3:GetObject',
          Resource: Match.anyValue(),
        }),
      ]),
    },
  });
});
