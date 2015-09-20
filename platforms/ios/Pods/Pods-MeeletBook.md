## Steps necessary to perform after updating pods
- Add Framework.plist to project Pods
- Change Key 'CFBundleIdentifier' to correspondent workspace name
- Append 'Run Script' to Build Phases
<pre><code>
`` # name and build location
FRAMEWORK_NAME=${PROJECT_NAME}
FRAMEWORK_BUILD_PATH="${PROJECT_DIR}/build/Framework" ``<br>
`` # these never change
FRAMEWORK_VERSION=A
FRAMEWORK_CURRENT_VERSION=1
FRAMEWORK_COMPATIBILITY_VERSION=1 ``<br>
`` # Clean any existing framework that might be there
if [ -d "$FRAMEWORK_BUILD_PATH" ]
then
echo "Framework: Cleaning framework..."
rm -rf "$FRAMEWORK_BUILD_PATH"
fi ``<br>
`` # Build the canonical Framework bundle directory structure
echo "Framework: Setting up directories..."
FRAMEWORK_DIR=$FRAMEWORK_BUILD_PATH/$FRAMEWORK_NAME.framework
mkdir -p $FRAMEWORK_DIR
mkdir -p $FRAMEWORK_DIR/Versions
mkdir -p $FRAMEWORK_DIR/Versions/$FRAMEWORK_VERSION
mkdir -p $FRAMEWORK_DIR/Versions/$FRAMEWORK_VERSION/Resources
mkdir -p $FRAMEWORK_DIR/Versions/$FRAMEWORK_VERSION/Headers ``<br>
`` echo "Framework: Creating symlinks..."
ln -s $FRAMEWORK_VERSION $FRAMEWORK_DIR/Versions/Current
ln -s Versions/Current/Headers $FRAMEWORK_DIR/Headers
ln -s Versions/Current/Resources $FRAMEWORK_DIR/Resources
ln -s Versions/Current/$FRAMEWORK_NAME $FRAMEWORK_DIR/$FRAMEWORK_NAME ``<br>
`` # combine lib files for various platforms into one
echo "Framework: Creating library..."
if [ "${CONFIGURATION}" = "Debug" -a -f "${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}.a" -a -f "${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/lib${TARGET_NAME}.a" ]
then
libtool -static -o ${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}.a `ls ${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}*.a|grep -v lib${TARGET_NAME}.a`
libtool -static -o ${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/lib${TARGET_NAME}.a `ls ${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/lib${TARGET_NAME}*.a|grep -v lib${TARGET_NAME}.a`
lipo -create "${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}.a" "${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/lib${TARGET_NAME}.a" -o "$FRAMEWORK_DIR/Versions/Current/$FRAMEWORK_NAME"
fi
if [ "${CONFIGURATION}" = "Release" -a -f "${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}.a" ]
then
cp -f "${BUILD_DIR}/${CONFIGURATION}-iphoneos/lib${TARGET_NAME}.a" "$FRAMEWORK_DIR/Versions/Current/$FRAMEWORK_NAME"
fi ``<br>
`` echo "Framework: Copying assets into current version..."
for dirname in `ls -l ${SRCROOT}/Headers/Public|grep ^d|awk '{print $9}'`
do
echo $dirname
count=`ls ${SRCROOT}/Headers/Public/$dirname/*.h|grep -c .h`
if [[ "$count" -gt "0" ]]
then
mkdir -p $FRAMEWORK_DIR/Headers/$dirname
cp ${SRCROOT}/Headers/Public/$dirname/*.h $FRAMEWORK_DIR/Headers/$dirname
fi
done ``<br>
`` #replace placeholder in plist with project name
cat "${SRCROOT}/Framework.plist" | sed 's/${PROJECT_NAME}/'"${PROJECT_NAME}"'/' > $FRAMEWORK_DIR/Resources/Info.plist ``
</code></pre>
- Remove libPods-MeeletClient.a reference from MeeletClient project
- Update Pods-MeeletClient-prefix.pch to import necessary headers for some pods