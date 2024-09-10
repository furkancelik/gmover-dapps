"use client";

import { useEthereum } from "@/context/EthereumContext";
import IntroTextEffect from "@/hooks/useTypewriter";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { FiRefreshCcw, FiRefreshCw } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const SCREEN_CONNECT_WALLET = -1;
const SCREEN_HOME = 0;
const SCREEN_FARM = 1;
const SCREEN_RESOURCE = 2;
const SCREEN_MILL = 3;
const SCREEN_DRY_LAND = 4;
const SCREEN_GRASS_LAND = 5;
const SCREEN_PLAY_GAME = 6;

const Info = ({ setPlayGame, loading, claimLand, error }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonError, setButtonError] = useState(false);
  const { userAddress, connectWallet } = useEthereum();

  const [screen, setScreen] = useState(SCREEN_HOME);

  useEffect(() => {
    if (userAddress === "") {
      setScreen(SCREEN_CONNECT_WALLET);
    } else {
      setScreen(SCREEN_HOME);
    }
  }, [userAddress]);

  function renderScreen() {
    if (loading) {
      if (error) {
        return (
          <div className="flex-1 h-full flex flex-col items-center justify-center">
            <div className=" text-red-900 text-xl font-semibold">
              Error Occurred
            </div>
            <div className=" whitespace-pre-wrap">
              <span className=" font-semibold">
                An unexpected error occurred:
              </span>
              <span className="font-mono text-sm">{error}</span>
            </div>
            <button
              onClick={() => {
                window.location = "/";
              }}
              className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              <FiRefreshCcw />
            </button>
          </div>
        );
      }
      return (
        <div className="">
          <h3>Loading Game...</h3>
          <p className=" w-full flex items-center justify-center mt-4">
            <ImSpinner8 size={30} className="animate-spin text-4xl" />
          </p>
        </div>
      );
    }
    switch (screen) {
      case SCREEN_CONNECT_WALLET:
        return (
          <>
            <IntroTextEffect
              key="connect-wallet-title"
              className={"text-[#653d1d] font-bold"}
              story={`Cüzdanı Bağla!`}
              speed={100}
              delay={0}
            />
            <IntroTextEffect
              key="connect-wallet-description"
              className="text-[#653d1d]"
              story={`Gmover MOVEMENT EVM Ağında geliştirilmiş bir oyna kazan oyunudur. Oyuna başlamak için lütfen cüzdanınızı bağlayın`}
              speed={5}
              delay={500}
            />
            <button
              onClick={connectWallet}
              className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              Connect Wallet
            </button>
          </>
        );
      case SCREEN_HOME:
        return (
          <>
            <IntroTextEffect
              key="home-title"
              className={"text-[#653d1d] font-bold"}
              story={`Oyun Bitti!`}
              speed={100}
              delay={0}
            />
            <IntroTextEffect
              key="home-description"
              className="text-[#653d1d]"
              story={`Yıllar önce bu topraklar yaşam doluydu.
Şimdi  Araziler kurudu, mahsuller yok oldu… 
FarmVille’in altın günlerinden geriye yalnızca terkedilmiş bir çiftlik kaldı.
Gmover ile her şey yeniden başlıyor.`}
              speed={5}
              delay={500}
            />
          </>
        );
      case SCREEN_FARM:
        return (
          <>
            <IntroTextEffect
              key="farm-title"
              className={"text-[#653d1d] font-bold"}
              story={`Çiftlik Eviniz!`}
            />
            <IntroTextEffect
              key="farm-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Çiftlik eviniz, çiftliğinizin merkezi ve en önemli yapılarından biridir. Bu ev, çiftlik hakkında detaylı bilgilere erişmenizi ve çiftliğinizin gelişim sürecini takip etmenizi sağlar. Ayrıca, çiftlik evinden satın alabileceğiniz yeni itemlere göz atabilir, çiftliğinizi daha verimli hale getirmek için stratejiler oluşturabilirsiniz.`}
            />
          </>
        );
      case SCREEN_RESOURCE:
        return (
          <>
            <IntroTextEffect
              key="resource-title"
              className={"text-[#653d1d] font-bold"}
              story={`Kaynak Toplama`}
            />
            <IntroTextEffect
              key="resource-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Her gün 1 kere ücretsiz olarak kaynak toplayabilirsiniz. Bu kaynakları, çiftliğinizdeki kurak toprakları yeşil ve verimli hale getirmek için kullanabilirsiniz. Kaynak toplamak tamamen ücretsizdir ve her 24 saatte bir yeni kaynak elde edebilirsiniz.`}
            />
          </>
        );
      case SCREEN_MILL:
        return (
          <>
            <IntroTextEffect
              key="mill-title"
              className={"text-[#653d1d] font-bold"}
              story={`Değirmen`}
            />
            <IntroTextEffect
              key="mill-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Değirmende günlük görevlerle çiftliğinizi daha verimli hale getirin. Görevleri tamamladıkça puanlar kazanın ve bu puanları çiftliğinizi büyütmek için kullanın. Günlük görevler çiftliğinizin büyümesine katkı sağlar ve sizi daha üretken kılar.`}
            />
          </>
        );
      case SCREEN_DRY_LAND:
        return (
          <>
            <IntroTextEffect
              key="dry-land-title"
              className={"text-[#653d1d] font-bold"}
              story={`Kurak Arazi`}
            />
            <IntroTextEffect
              key="dry-land-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Çiftliğinizdeki kurak araziler, eski ihtişamını kaybetmiş ve ekim yapılamayan topraklardır. Ancak, kaynak toplayarak bu toprakları yeniden canlandırabilirsiniz. Günde bir kere kaynak toplamak ücretsizdir ve topladığınız kaynaklar sayesinde bu arazileri yeşil ve verimli hale getirebilirsiniz.`}
            />
          </>
        );
      case SCREEN_GRASS_LAND:
        return (
          <>
            <IntroTextEffect
              key="grass-land-title"
              className={"text-[#653d1d] font-bold"}
              story={`Ekilebilir (Verimli) Arazi`}
            />
            <IntroTextEffect
              key="grass-land-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Ekilebilir araziler, mahsul ekmeye ve çiftliğinizi geliştirmeye hazır alanlardır. Kurak arazileri kaynaklarınızla canlandırdıktan sonra bu alanlara ürün ekebilir ve verimli hale getirebilirsiniz. Ekilebilir araziler, çiftliğinizin büyümesinde önemli bir rol oynar.`}
            />
          </>
        );
      case SCREEN_PLAY_GAME:
        return (
          <>
            <IntroTextEffect
              key="play-game-title"
              className={"text-[#653d1d] font-bold"}
              story={`Oyuna Başlayalım`}
            />
            <IntroTextEffect
              key="play-game-description"
              delay={50 * 15}
              className="text-[#653d1d]"
              story={`Tüm bilgileri edindiğine göre şimdi oyuna başlayabiliriz.`}
            />
          </>
        );
      default:
        return null;
    }
  }

  function renderButton() {
    if (loading) return null;
    switch (screen) {
      case SCREEN_HOME:
        return (
          <button
            key={"button-home"}
            onClick={() => {
              setScreen(SCREEN_FARM);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_FARM:
        return (
          <button
            key={"button-farm"}
            onClick={() => {
              setScreen(SCREEN_RESOURCE);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_RESOURCE:
        return (
          <button
            key={"button-resource"}
            onClick={() => {
              setScreen(SCREEN_MILL);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_MILL:
        return (
          <button
            key={"button-mill"}
            onClick={() => {
              setScreen(SCREEN_DRY_LAND);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_DRY_LAND:
        return (
          <button
            key={"button-dry-land"}
            onClick={() => {
              setScreen(SCREEN_GRASS_LAND);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_GRASS_LAND:
        return (
          <button
            key={"button-grass-lang"}
            onClick={() => {
              setScreen(SCREEN_PLAY_GAME);
            }}
            className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Devam Et
          </button>
        );
      case SCREEN_PLAY_GAME:
        return (
          <>
            {!buttonError && (
              <button
                key={"button-play-game"}
                disabled={buttonLoading}
                onClick={async () => {
                  setButtonLoading(true);

                  try {
                    await claimLand();
                  } catch (e) {
                    setButtonError(true);
                  }
                }}
                className={`${
                  buttonLoading ? "opacity-50" : ""
                } mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white`}
              >
                {buttonLoading ? "Yükleniyor.." : "Oyuna Başla"}
              </button>
            )}

            {buttonError && (
              <button
                key={"button-refresh"}
                onClick={() => {
                  window.location = "/";
                }}
                className={` mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] active:from-[#48b407] active:to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white`}
              >
                <FiRefreshCw />
              </button>
            )}
          </>
        );
      default:
        return null;
    }
  }

  function renderImage() {
    if (loading) return null;
    switch (screen) {
      case SCREEN_HOME:
        return (
          <img
            src="/farmer-pepe.png"
            className="h-48 -translate-y-5 "
            alt="pepe"
          />
        );
      case SCREEN_FARM:
        return (
          <img src="/ev2.png" className="h-48 -translate-y-5 " alt="pepe" />
        );
      case SCREEN_RESOURCE:
        return (
          <img src="/kaynak2.png" className="h-48 -translate-y-5 " alt="pepe" />
        );
      case SCREEN_MILL:
        return (
          <img
            src="/degirmen.png"
            className="h-48 -translate-y-5 "
            alt="pepe"
          />
        );
      case SCREEN_DRY_LAND:
        return <img src="/a.png" className="h-48 -translate-y-5 " alt="pepe" />;
      case SCREEN_GRASS_LAND:
        return <img src="/b.png" className="h-48 -translate-y-5 " alt="pepe" />;
      case SCREEN_PLAY_GAME:
        return (
          <img
            src="/farmer-pepe.png"
            className="h-48 -translate-y-5 "
            alt="pepe"
          />
        );
      default:
        return null;
    }
  }
  return (
    <>
      <div
        className={` fixed w-full h-screen left-0 top-0 right-0 bottom-0 ${
          loading ? "bg-black" : "bg-black/60 opacity-40"
        } `}
      ></div>
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-50">
        <img src="sidemenu-title.png" className="md:w-64 w-32" />
      </div>
      <div className="absolute bottom-5 left-0 right-0 w-full h-48">
        <div className="container mx-auto flex items-center justify-center relative">
          <img src="/bottom-menu.png" className="w-full h-48" alt="menu" />
          <div className="absolute px-10  h-48  w-full flex flex-row items-center justify-between ">
            <div className="h-full -mb-1">{renderImage()}</div>
            <div className=" flex-1 text-center overflow-scroll  h-32 p-1 ">
              {renderScreen()}
            </div>
            <div className="mx-2 mr-5">{renderButton()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Info;
