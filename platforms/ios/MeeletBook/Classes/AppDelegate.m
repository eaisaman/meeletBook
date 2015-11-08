/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"
#import "RCTEventDispatcher.h"
#import <Cordova/CDVPlugin.h>

@implementation AppDelegate
{
    NSMutableArray *_dispatcherArray;
    dispatch_semaphore_t _eventDispatcherSemaphore;
}

- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    
    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
    
    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
#if __has_feature(objc_arc)
    NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
    NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
    [NSURLCache setSharedURLCache:sharedCache];
    
    self = [super init];
    return self;
}

- (void)addEventDispatcher:(id)dispatcher
{
    dispatch_semaphore_wait(_eventDispatcherSemaphore, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 2));
    
    if ([_dispatcherArray indexOfObject:dispatcher] == NSNotFound) {
        [_dispatcherArray addObject:dispatcher];
    }

    dispatch_semaphore_signal(_eventDispatcherSemaphore);
}

- (void)removeEventDispatcher:(id)dispatcher
{
    dispatch_semaphore_wait(_eventDispatcherSemaphore, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 2));
    
    [_dispatcherArray removeObject:dispatcher];

    dispatch_semaphore_signal(_eventDispatcherSemaphore);
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#warning Copy sample png files to shared resource folder to mimic the situation of displaying downloaded pictures
    [[NSFileManager defaultManager] copyItemAtPath:[[NSBundle mainBundle] pathForResource:@"dog1-character" ofType:@"png"] toPath:[[Global sharedResourcePath] stringByAppendingPathComponent:@"dog1-character.png"] error:nil];
    [[NSFileManager defaultManager] copyItemAtPath:[[NSBundle mainBundle] pathForResource:@"fox-character" ofType:@"png"] toPath:[[Global sharedResourcePath] stringByAppendingPathComponent:@"fox-character.png"] error:nil];
    [[NSFileManager defaultManager] copyItemAtPath:[[NSBundle mainBundle] pathForResource:@"book-1" ofType:@"png"] toPath:[[Global sharedResourcePath] stringByAppendingPathComponent:@"book-1.png"] error:nil];
    [[NSFileManager defaultManager] copyItemAtPath:[[NSBundle mainBundle] pathForResource:@"book-2" ofType:@"png"] toPath:[[Global sharedResourcePath] stringByAppendingPathComponent:@"book-2.png"] error:nil];
    [[NSFileManager defaultManager] copyItemAtPath:[[NSBundle mainBundle] pathForResource:@"book-3" ofType:@"png"] toPath:[[Global sharedResourcePath] stringByAppendingPathComponent:@"book-3.png"] error:nil];
    
    NSURL *jsCodeLocation;
    
    /**
     * Loading JavaScript code - uncomment the one you want.
     *
     * OPTION 1
     * Load from development server. Start the server from the repository root:
     *
     * $ npm start
     *
     * To run on device, change `localhost` to the IP address of your computer
     * (you can get this by typing `ifconfig` into the terminal and selecting the
     * `inet` value under `en0:`) and make sure your computer and iOS device are
     * on the same Wi-Fi network.
     */
    
    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    
    /**
     * OPTION 2
     * Load from pre-bundled file on disk. To re-generate the static bundle
     * from the root of your project directory, run
     *
     * $ react-native bundle --minify
     *
     * see http://facebook.github.io/react-native/docs/runningondevice.html
     */
    
    //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"MeeletBook"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [[UIViewController alloc] init];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    
    _dispatcherArray = [NSMutableArray array];
    _eventDispatcherSemaphore = dispatch_semaphore_create(0);
    
    RCTEventDispatcher *_eventDispatcher = [RCTEventDispatcher new];
    ((id<RCTBridgeModule>)_eventDispatcher).bridge = rootView.bridge;
    [self addEventDispatcher:_eventDispatcher];

    [Global initEventDispatcher:self];
    [Global initApplication];

    return YES;
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if MeeletBook-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
    if (!url) {
        return NO;
    }
    
    // all plugins will get the notification, and their handlers will be called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    
    return YES;
}

// repost all remote and local notification using the default NSNotificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

#ifndef DISABLE_PUSH_NOTIFICATIONS

- (void)                                 application:(UIApplication*)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
{
    // re-post ( broadcast )
    NSString* token = [[[[deviceToken description]
                         stringByReplacingOccurrencesOfString:@"<" withString:@""]
                        stringByReplacingOccurrencesOfString:@">" withString:@""]
                       stringByReplacingOccurrencesOfString:@" " withString:@""];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
}

- (void)                                 application:(UIApplication*)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
}
#endif

- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);
    
    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}

#pragma mark IEventDispatcher implementation
- (void)sendAppEventWithName:(NSString *)name body:(NSDictionary*)body
{
    dispatch_async(dispatch_get_main_queue(), ^{
        dispatch_semaphore_wait(_eventDispatcherSemaphore, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 2));

        [_dispatcherArray enumerateObjectsUsingBlock:^(id dispatcher, NSUInteger idx, BOOL *stop) {
            if ([dispatcher respondsToSelector:@selector(sendAppEventWithName:body:)]) {
                [dispatcher performSelector:@selector(sendAppEventWithName:body:) withObject:name withObject:body];
            }
        }];

        dispatch_semaphore_signal(_eventDispatcherSemaphore);
    });
}
@end
