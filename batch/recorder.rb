# encoding: utf-8

class Recorder

  def rec title, duration, dist_dir
    puts `#{__dir__}/rec_radiko.sh TBS #{dist_dir}/#{toTitle(title)} #{duration}`
  end

  def toTitle title
    case title
      when 'radioto'
        "らじおと"
      when 'atoroku'
        "アフター6ジャンクション"
      when 'baka'
        "伊集院光深夜の馬鹿力"
      when 'machiyama'
        "町山智浩たまむすび"
      when 'cowboy'
        "爆笑問題カーボーイ"
      when 'mygame-mylife'
        "マイゲーム・マイライフ"
      when 'bananamoon'
        "バナナムーン"
      when 'elekata'
        "エレ片のコント太郎"
      else
        title
    end
  end
end

Recorder.new.rec ARGV[0], ARGV[1], ARGV[2] if __FILE__ == $0

