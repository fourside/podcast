# encoding : utf-8
#
# 約5ヶ月たったファイルを削除
#
require 'fileutils'
require 'time'

class CleanUp

  FIVE_MONTHS = 60 * 60 * 24 * 7 * 20 # 20 weeks
  MESSED_DIR  = File.dirname(__FILE__) + '/../public/mp3/'

  def clean
    five_months_ago = Time.now - FIVE_MONTHS
    Dir.glob(MESSED_DIR + '/*.mp3').map do |mp3|
      if File::stat(mp3).mtime < five_months_ago
        FileUtil.rm(mp3)
      end
    end
  end
end

CleanUp.new.clean if __FILE__ == $0
