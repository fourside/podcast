# encoding : utf-8
require "rubygems"
require "mp3info"


class Mp3tag

  def edit filename
    Mp3Info.open(filename) do |mp3|
      taglist = taglist(filename)
      mp3.tag.title  = filename
      mp3.tag.artist = taglist[0]
      mp3.tag.album  = taglist[1]
      mp3.tag.year   = Time.now.year
    end
  end

  def taglist filename
    case filename
    when /深夜の馬鹿力/
      %{伊集院光 伊集院光・深夜の馬鹿力}
    when /爆笑問題カーボーイ/
      %{爆笑問題 爆笑問題カーボーイ}
    when /町山智浩/
      %{町山智浩 たまむすび}
    when /週末TUTAYA/
      %{伊集院光・小林悠 週末TUTAYAに行ってこれ借りよう}
    when /バナナムーン/
      %{バナナマン バナナムーンGOLD}
    when /ウィークエンドシャッフル/
      %{ライムスター宇多丸 ウィークエンドシャッフル}
    when /エレ片のコント太郎/
      %{エレキコミック・片桐仁 エレ片のコント太郎}
    else
      %{unknown unknown}
    end
  end
end

Mp3tag.edit ARGV[0] if __FILE__ == $0
