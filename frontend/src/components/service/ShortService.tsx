import { shortServiceCategoryData } from '@/data/shortService';
import ShortServiceBlock from './ShortServiceBlock';

export default function ShortService() {
  return (
    <div>
      <div className="rts-shorts-service-area rts-section-gap bg_primary mt-5">
        <div className="container">
          <div className="row g-5 justify-content-center">
            {shortServiceCategoryData?.map((datum, key)=>{
              return <ShortServiceBlock 
                      key={key}
                      iconType={datum?.iconType} 
                      title={datum?.title} 
                      description={datum?.description} 
                      />
            })}
          </div>
        </div>
      </div>

    </div>
  );
}