# coding : utf-8

class Mp3tag

  def run
    argv1 = ARGV[1].dup # argv is frozen
    mp3 = argv1.force_encoding('UTF-8')

    case ARGV[0]
    when 'title'
      STDOUT.puts (tag mp3).title
    when 'artist'
      STDOUT.puts (tag mp3).artist
    when 'year'
      STDOUT.puts (tag mp3).year
    else
      STDOUT.puts "error"
      exit 1
    end
  end

  def tag filename
    case filename
    when /らじおと/
      Tag.new "伊集院光", "伊集院光とらじおと"
    when /深夜の馬鹿力/
      Tag.new "伊集院光", "伊集院光・深夜の馬鹿力"
    when /爆笑問題カーボーイ/
      Tag.new "爆笑問題", "爆笑問題カーボーイ"
    when /町山智浩/
      Tag.new "町山智浩", "たまむすび"
    when /週末TUTAYA/
      Tag.new "伊集院光・小林悠", "週末TUTAYAに行ってこれ借りよう"
    when /粋な夜電波/
      Tag.new "菊地成孔", "菊地成孔の粋な夜電波"
    when /バナナムーン/
      Tag.new "バナナマン", "バナナムーンGOLD"
    when /ウィークエンドシャッフル/
      Tag.new "ライムスター宇多丸", "ウィークエンドシャッフル"
    when /マイゲーム・マイライフ/
      Tag.new "ライムスター宇多丸", "マイゲーム・マイライフ"
    when /アフター6ジャンクション/
      Tag.new "ライムスター宇多丸", "アフター6ジャンクション"
    when /エレ片のコント太郎/
      Tag.new "エレキコミック・片桐仁", "エレ片のコント太郎"
    else
      Tag.new "unknown", "unknown"
    end
  end
end

class Tag
  attr_accessor :artist, :title, :year
  def initialize artist, title
    @artist, @title, @year = artist, title, Time.now.year
  end
end

Mp3tag.new.run if __FILE__ == $0
