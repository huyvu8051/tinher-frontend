import Nofication from '@/components/global/Nofication.vue'
import ImageWrapper from '@/components/global/ImageWrapper.vue'
import FlexLayout from '@/components/global/FlexLayout.vue'
const GlobalComponents = {
    install(app) {
       // app.component('h-upload-file', UploadFile);
        app.component('h-image-wrapper', ImageWrapper);
       // app.component('h-date-formater', DateFormater);
        app.component('h-nofication', Nofication);
        app.component('h-flex-layout', FlexLayout);

    }
}

export default GlobalComponents;