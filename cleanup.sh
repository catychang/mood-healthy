#!/bin/bash

# 备份文件
rm -f *.bak *.orig *.before_* *backup.html *.backup 

# 临时文件
rm -f *-e .DS_Store mood-interaction*.js.temp mood-interaction*.js.new

# 测试文件
rm -f test-*.html test-*.js time-button-debug.js

# 已弃用版本
rm -f mood-interaction*.js.fixed_backup

echo "清理完成！" 