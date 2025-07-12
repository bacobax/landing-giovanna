"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { GalleryImage } from "@/lib/gallery"

export function GalleryContent() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + "..."
  }

  useEffect(() => {
    // Since we can't use server-side functions in client components,
    // we'll use a static array of the actual images
    const galleryImages: GalleryImage[] = [
      {
        id: "artwork-7",
        src: "/assets/IMG_4666 2.png",
        alt: "Eco di Nebbia - Opera astratta con sfumature eteree di rosa cipria, beige, grigio e cenni verdastri che trasmette la sensazione di un paesaggio lontano avvolto nella nebbia",
        title: "Eco di Nebbia",
        description: "Con sfumature eteree di rosa cipria, beige, grigio e cenni verdastri, quest'opera astratta trasmette la sensazione di un paesaggio lontano avvolto nella nebbia. Le pennellate leggere e sfumate evocano il riflesso di alberi sull'acqua o la memoria di qualcosa appena intravista. Nulla è definito, ma tutto è percepibile, come un ricordo che affiora dolcemente alla coscienza. L'effetto visivo è quieto, meditativo, quasi sonoro, come se il quadro emettesse un \"eco silenzioso\" che invita all'ascolto interiore.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-12",
        src: "/assets/IMG_4671 2.png",
        alt: "Ordine Organico - Opera scultorea composta da moduli in legno che richiama una griglia tridimensionale fatta di pieni e vuoti",
        title: "Ordine Organico",
        description: "Quest'opera scultorea composta da moduli in legno richiama una griglia tridimensionale fatta di pieni e vuoti. I blocchi, simili ma non identici, creano un ritmo visivo che si alterna tra regolarità e imperfezione naturale, evocando la bellezza dell'artigianato e della materia viva. Il contrasto tra l'ordine geometrico e le venature irregolari del legno suggerisce un equilibrio tra struttura e natura. Oltre al valore estetico, l'opera potrebbe anche avere una funzione fonoassorbente, come nei pannelli acustici, coniugando arte e utilità.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-9",
        src: "/assets/IMG_4668 2.png",
        alt: "Tracce d'Oro nel Silenzio - Dipinto astratto con pennellate materiche e sovrapposte in una danza di bianchi, beige e rossi terrosi interrotta da frammenti dorati",
        title: "Tracce d'Oro nel Silenzio",
        description: "Questo dipinto astratto si compone di pennellate materiche e sovrapposte, in una danza di bianchi, beige e rossi terrosi, interrotta qua e là da frammenti dorati che sembrano custodire qualcosa di prezioso. L'effetto generale è quello di una parete antica, consumata dal tempo ma ancora viva, come se conservasse memorie sedimentate tra le sue texture. Il contrasto tra la vibrazione dei rossi e la quiete dei toni neutri crea una tensione armonica, mentre l'oro affiora come scintille di luce in un paesaggio interiore. Un'opera che invita alla contemplazione e alla scoperta lenta",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-1",
        src: "/assets/IMG_4662.png",
        alt: "Intersezioni Silenziose - Opera astratta con rete di linee incrociate, apparentemente casuali ma disposte con equilibrio e ritmo",
        title: "Intersezioni Silenziose",
        description: "Questa opera astratta gioca con una rete di linee incrociate, apparentemente casuali, ma disposte con equilibrio e ritmo. I tratti rossi, bianchi e bruni emergono su uno sfondo etereo dalle sfumature neutre, suggerendo un paesaggio mentale fatto di connessioni, separazioni e dialoghi silenziosi. Ogni incrocio può essere letto come un punto d'incontro tra pensieri, memorie o emozioni, lasciando spazio all'interpretazione soggettiva dell'osservatore. L'insieme trasmette un senso di calma contemplativa e struttura fluttuante.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-13",
        src: "/assets/IMG_4672 2.png",
        alt: "Frammenti in Ocre - Composizione con linee morbide e forme astratte che si intrecciano in toni caldi e materici",
        title: "Frammenti in Ocre",
        description: "Linee morbide e forme astratte si intrecciano in questa composizione dai toni caldi e materici, dove il giallo ocra dialoga con il grigio e il bianco in un gioco di pieni e vuoti. L'opera evoca una danza silenziosa tra elementi organici e spigolature geometriche, suggerendo frammenti di una realtà scomposta e ricomposta secondo un equilibrio tutto interiore. Il tratto è deciso ma controllato, con texture che richiamano il carboncino e la matita, dando profondità e dinamismo al disegno. Un invito a trovare armonia nelle forme spezzate.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-3",
        src: "/assets/IMG_4663.png",
        alt: "Bosco Silente - Foresta astratta con forme essenziali e ripetute che evocano alberi stilizzati sospesi in un'atmosfera rarefatta",
        title: "Bosco Silente",
        description: "Una foresta astratta prende vita attraverso forme essenziali e ripetute che evocano alberi stilizzati, sospesi in un'atmosfera rarefatta. Le chiome bianche, definite da tratti neri e rossi, sembrano fluttuare sopra sottili tronchi che affondano in un terreno appena accennato. Il fondo neutro e sfumato, tra il grigio e il sabbia, contribuisce a creare una sensazione di quiete sospesa, come se il bosco fosse immerso in una nebbia mattutina o in un sogno. Un'opera che trasmette delicatezza, ritmo e profondità con pochi, calibrati elementi.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-5",
        src: "/assets/IMG_4664 2.png",
        alt: "Dialoghi Materici - Composizione bifocale che accosta due tele complementari unite da un linguaggio materico ma divergenti nell'espressione",
        title: "Dialoghi Materici",
        description: "Questa composizione bifocale accosta due tele complementari, unite da un linguaggio materico ma divergenti nell'espressione.A sinistra, una danza di impronte rosso terroso su sfondo bianco evoca petali, foglie o cellule in movimento, suggerendo un'energia vitale e spontanea. La texture corposa del bianco sembra avvolgere le forme, come un respiro che le accompagna. A destra, una tela più sobria e concettuale ospita piccole tessere di legno immerse in una superficie bianca lavorata, che ricorda l'intonaco o la neve. I cubi emergono come frammenti architettonici o pensieri sedimentati, suggerendo ordine, misura e tempo. Insieme, le due opere instaurano un dialogo tra gesto e struttura, natura e astrazione, spontaneità e costruzione.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-6",
        src: "/assets/IMG_4665 2.png",
        alt: "Frequenze Silenziose - Cinque linee sinuose che si elevano verticalmente su una tela monocromatica creando un ritmo visivo essenziale e ipnotico",
        title: "Frequenze Silenziose",
        description: "Cinque linee sinuose si elevano verticalmente su una tela monocromatica, creando un ritmo visivo essenziale e ipnotico. L'opera, giocata su toni completamente bianchi, punta tutto sulla materia e sulla luce: le ombre che si formano sulle curve restituiscono profondità e movimento a un'opera che, a prima vista, sembra minimale ma nasconde una vibrante vibrazione interna. Le forme richiamano onde sonore, vibrazioni naturali o movimenti organici, come flussi d'aria o correnti marine. È un'opera tattile e meditativa, dove l'assenza di colore esalta la purezza della forma e invita a rallentare, osservare e ascoltare.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-8",
        src: "/assets/IMG_4667 2.png",
        alt: "Soglia Dorata - Opera verticale con due fasce materiche bianche che incorniciano una colonna centrale rosa cipria attraversata da frammenti dorati",
        title: "Soglia Dorata",
        description: "Quest'opera verticale colpisce per la sua elegante semplicità e la forza simbolica del suo linguaggio visivo. Due fasce materiche bianche, lavorate con spatolate dense e gestuali, incorniciano una colonna centrale rosa cipria attraversata da frammenti dorati, come foglie d'oro disperse dal vento. La composizione richiama l'idea di una soglia sacra o di un passaggio interiore, dove il bianco rappresenta il silenzio, la quiete o l'attesa, mentre l'oro centrale vibra come un'energia spirituale, una promessa di luce o trasformazione. Un'opera che unisce materia e luce, rigore e poesia, in un equilibrio raffinato e contemplativo.",
        medium: "Mixed media",
        year: "2024"
      },
      {
        id: "artwork-10",
        src: "/assets/IMG_4669 2.png",
        alt: "Echi Radiali - Vortice di linee concentriche e segni materici che si espande dal centro della tela come onde sonore",
        title: " Echi Radiali",
        description: "Un vortice di linee concentriche e segni materici si espande dal centro della tela come onde sonore, o come i cerchi lasciati da una goccia sull'acqua. L'uso monocromatico del marrone su bianco accentua la sensazione di profondità e movimento, generando un effetto ipnotico e contemplativo. L'opera sembra catturare il passaggio del tempo o la traccia di un'energia impressa sulla superficie: qualcosa che pulsa, che si propaga, che lascia memoria. L'imprecisione dei bordi e le irregolarità volute della texture ricordano la materia viva della natura — la corteccia di un albero, un disco inciso, o l'occhio di un ciclone. Un'opera densa di significati astratti e simbolici, che invita a un ascolto visivo.",
        medium: "Mixed media",
        year: "2024"
      },

    ]
    
    setImages(galleryImages)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-600">Caricamento galleria...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <p className="text-lg text-center max-w-3xl mx-auto text-gray-700">
        Esplora una selezione di opere uniche e curate. Ogni opera racconta una storia e è progettata per trasformare gli spazi con eleganza e autenticità.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => {
          const isExpanded = expandedCards.has(image.id)
          const displayDescription = isExpanded ? image.description : truncateDescription(image.description)
          
          return (
            <Card
              key={image.id}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={image.src}
                  width={400}
                  height={300}
                  alt={image.alt}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0"></div>
              </div>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-playfair font-semibold text-gray-900">{image.title}</h3>
                <p className="text-gray-600 text-sm">{image.medium}, {image.year}</p>
                <p className="text-gray-700">{displayDescription}</p>
                {image.description.length > 150 && (
                  <><Button 
                    variant="link" 
                    className="p-0 h-auto text-primary-tan hover:text-primary-tan/80"
                    onClick={() => toggleCardExpansion(image.id)}
                  >
                    {isExpanded ? "Leggi meno" : "Leggi di più"}
                  </Button><br /></>
                )}
                <Button variant="link" className="p-0 h-auto text-primary-tan hover:text-primary-tan/80">
                  Scopri di più
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 