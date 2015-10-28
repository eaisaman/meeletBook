//
//  LocalResourceManager.m
//  MeeletBook
//
//  Created by jill on 15/10/26.
//
//

#import "Global.h"
#import "LocalResourceManager.h"
#import "RCTBridge.h"

@implementation LocalResourceManager

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getResourcePath:(NSString*)fileName callback:(RCTResponseSenderBlock)callback){
    NSString *filePath = [[Global sharedResourcePath] stringByAppendingPathComponent:fileName];
    
    callback(@[[NSNull null], filePath]);
}

@end
