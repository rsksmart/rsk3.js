#!/bin/sh

set -e

PACKAGES=$( ls ./packages/ )
VERSION=$( node -p "require('./package').version" )
echo "\"module\",\"shasum_local\",\"shasum_remote\""
for PACKAGE in ${PACKAGES} ; do
  cd ./packages/${PACKAGE}
  PACKAGE_VERSION=$( node -p "require('./package').version" )
  if [ "${VERSION}" != "${PACKAGE_VERSION}" ] ; then
    echo "${PACKAGE} - expected version to be ${VERSION}, but found ${PACKAGE_VERSION}"
    exit 1
  fi
  PACKAGE_SHA_LOCAL=$( npm pack --dry-run 2>&1 >/dev/null | grep "shasum: " | awk '{print $NF}' )
  npm publish
  PACKAGE_SHA_REMOTE=$( npm view @rsksmart/${PACKAGE}@${VERSION} dist.shasum )
  echo "\"@rsksmart/${PACKAGE}@${VERSION}\",\"${PACKAGE_SHA_LOCAL}\",\"${PACKAGE_SHA_REMOTE}\""
  if [ "${PACKAGE_SHA_LOCAL}" != "${PACKAGE_SHA_REMOTE}" ] ; then
    echo "${PACKAGE} - local shasum is ${PACKAGE_SHA_LOCAL}, but published shasum is ${PACKAGE_SHA_REMOTE}"
    exit 1
  fi
  cd ../..
done
