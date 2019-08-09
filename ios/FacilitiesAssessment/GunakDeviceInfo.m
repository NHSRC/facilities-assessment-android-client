// CalendarManager.m
#import "GunakDeviceInfo.h"
#import "DeviceUID.h"

@implementation GunakDeviceInfo

// To export a module named GunakDeviceInfo
RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
    NSString *uniqueId = [DeviceUID uid];
    return @{
             @"uniqueId": uniqueId
             };
}

@end
