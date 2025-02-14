import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { AwsDeployStack } from '../lib/aws-deploy-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
  const stack = new AwsDeployStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'cdk-rss-bucket',
  });

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultRootObject: 'index.html',
    },
  });
});
